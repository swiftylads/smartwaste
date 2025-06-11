from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__, static_folder='frontend')  
CORS(app)

# Load model
model = tf.keras.models.load_model("model.h5")

LABELS = ['battery', 'glass', 'metal', 'organic', 'paper', 'plastic']
IMG_SIZE = (224, 224)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    image = Image.open(file).convert('RGB')
    image = image.resize(IMG_SIZE)
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array)[0]
    predicted_index = int(np.argmax(predictions))
    predicted_label = LABELS[predicted_index]
    confidence = float(predictions[predicted_index])

    return jsonify({
        'label': predicted_label,
        'confidence': confidence,
        'all_probabilities': predictions.tolist()
    })

@app.route('/')
def serve_index():
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder), path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)