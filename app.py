from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__, static_folder='frontend')  
CORS(app)

# Load model dengan error handling
try:
    model = tf.keras.models.load_model("model.h5")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

LABELS = ['battery', 'glass', 'metal', 'organic', 'paper', 'plastic']
IMG_SIZE = (224, 224)

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
        
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
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
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/')
def serve_index():
    try:
        return send_from_directory(os.path.join(app.static_folder), 'index.html')
    except:
        return jsonify({'message': 'SmartWaste API is running on Railway!', 'status': 'success'})

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'labels': LABELS
    })

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory(os.path.join(app.static_folder), path)
    except:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    # Railway deployment
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)