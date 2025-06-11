// Deskripsi setiap jenis sampah
const wasteDatabase = {
  battery: {
    category: "Sampah B3 (Bahan Berbahaya Beracun)",
    description:
      "Baterai mengandung logam berat dan bahan kimia berbahaya yang dapat mencemari lingkungan jika tidak dikelola dengan benar.",
    managementTips: [
      "• Jangan buang ke tempat sampah biasa",
      "• Kumpulkan di tempat khusus baterai bekas",
      "• Bawa ke pusat daur ulang elektronik",
      "• Pisahkan dari sampah lainnya",
      "• Manfaatkan program take-back dari produsen",
    ],
    impact:
      "Baterai bekas dapat mencemari tanah dan air tanah dengan logam berat seperti merkuri, kadmium, dan timbal yang berbahaya bagi kesehatan manusia dan lingkungan.",
  },
  glass: {
    category: "Sampah Anorganik Daur Ulang",
    description:
      "Kaca adalah material yang dapat didaur ulang 100% tanpa kehilangan kualitas dan dapat diproses berkali-kali menjadi produk baru.",
    managementTips: [
      "• Bersihkan dari sisa makanan dan minuman",
      "• Pisahkan berdasarkan warna (bening, hijau, coklat)",
      "• Hati-hati saat menangani kaca pecah",
      "• Dapat didaur ulang menjadi botol baru",
      "• Lepaskan tutup logam atau plastik",
    ],
    impact:
      "Daur ulang kaca menghemat energi dan mengurangi emisi CO2. Satu ton kaca daur ulang menghemat 1,2 ton bahan baku.",
  },
  metal: {
    category: "Sampah Anorganik Daur Ulang",
    description:
      "Logam seperti aluminium, besi, dan tembaga memiliki nilai ekonomis tinggi dan dapat didaur ulang tanpa batas tanpa kehilangan kualitas.",
    managementTips: [
      "• Bersihkan dari sisa makanan",
      "• Pisahkan berdasarkan jenis logam",
      "• Aluminium kaleng memiliki nilai jual tinggi",
      "• Dapat dijual langsung ke pengepul",
      "• 100% dapat didaur ulang",
    ],
    impact:
      "Daur ulang logam menghemat energi hingga 95% dibanding produksi logam baru dan mengurangi penambangan bahan baku.",
  },
  organic: {
    category: "Sampah Organik",
    description:
      "Sampah organik adalah limbah yang berasal dari makhluk hidup seperti sisa makanan, daun, dan bahan alami lainnya. Dapat terurai secara alami dalam waktu relatif singkat.",
    managementTips: [
      "• Pisahkan dari sampah anorganik",
      "• Dapat dijadikan kompos untuk pupuk",
      "• Proses pengomposan membutuhkan 2-3 bulan",
      "• Hindari mencampur dengan minyak berlebihan",
      "• Dapat digunakan untuk biogas",
    ],
    impact:
      "Jika dikelola dengan baik, sampah organik dapat menjadi pupuk alami yang menyuburkan tanah dan mengurangi penggunaan pupuk kimia.",
  },
  paper: {
    category: "Sampah Anorganik Daur Ulang",
    description:
      "Kertas terbuat dari serat selulosa yang dapat didaur ulang hingga 5-7 kali. Merupakan salah satu jenis sampah yang paling mudah didaur ulang.",
    managementTips: [
      "• Pisahkan kertas bersih dari yang kotor",
      "• Lepaskan staples dan perekat",
      "• Dapat langsung dijual ke pengepul",
      "• Kertas bekas dapat menjadi kertas baru",
      "• Hindari mencampur dengan kertas berlapis lilin",
    ],
    impact:
      "Daur ulang kertas dapat menghemat energi hingga 60% dan mengurangi penebangan pohon untuk produksi kertas baru.",
  },
  plastic: {
    category: "Sampah Anorganik",
    description:
      "Plastik adalah polimer sintetis yang terbuat dari bahan petrokimia. Sampah plastik membutuhkan waktu ratusan tahun untuk terurai secara alami dan menjadi salah satu penyumbang pencemaran terbesar di dunia.",
    managementTips: [
      "• Bersihkan dari sisa makanan sebelum dibuang",
      "• Pisahkan berdasarkan jenis plastik (PET, HDPE, dll)",
      "• Kumpulkan di tempat sampah khusus plastik",
      "• Dapat didaur ulang menjadi produk baru",
      "• Hindari penggunaan plastik sekali pakai",
    ],
    impact:
      "Plastik yang tidak dikelola dengan baik dapat mencemari laut, membahayakan kehidupan laut, dan menghasilkan mikroplastik yang berbahaya bagi rantai makanan.",
  },
};

let selectedFile = null;

// File handling
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const removeImageBtn = document.getElementById("removeImage");
const classifyBtn = document.getElementById("classifyBtn");

// Results elements
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const results = document.getElementById("results");
const wasteType = document.getElementById("wasteType");
const wasteCategory = document.getElementById("wasteCategory");
const confidence = document.getElementById("confidence");
const description = document.getElementById("description");
const managementTips = document.getElementById("managementTips");
const environmentalImpact = document.getElementById("environmentalImpact");

// Event listeners
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.add("border-emerald-500", "bg-emerald-200");
});
dropzone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!dropzone.contains(e.relatedTarget)) {
    dropzone.classList.remove("border-emerald-500", "bg-emerald-200");
  }
});
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.remove("border-emerald-500", "bg-emerald-200");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect(files[0]);
  }
});

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0]);
  }
});

removeImageBtn.addEventListener("click", () => {
  imagePreview.classList.add("hidden");
  fileInput.value = "";
  selectedFile = null;
  resetResults();
});

classifyBtn.addEventListener("click", classifyImage);

function handleFileSelect(file) {
  if (file && file.type.startsWith("image/")) {
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      imagePreview.classList.remove("hidden");
      resetResults();
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please select a valid image file (JPG, PNG, WEBP)");
  }
}

function resetResults() {
  loadingState.classList.add("hidden");
  results.classList.add("hidden");
  emptyState.classList.remove("hidden");
}

async function classifyImage() {
  if (!selectedFile) {
    alert("Silakan pilih gambar terlebih dahulu.");
    return;
  }

  // Show loading state
  emptyState.classList.add("hidden");
  results.classList.add("hidden");
  loadingState.classList.remove("hidden");

  try {
    const formData = new FormData();
    formData.append("image", selectedFile);

    // Send request to Flask backend
    const response = await fetch("/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.label || data.confidence === undefined) {
      throw new Error("Invalid response from server");
    }

    const confidencePercentage = Math.round(data.confidence * 100);

    displayResults(data.label, confidencePercentage);
  } catch (error) {
    console.error("Error classifying image:", error);

    // Hide loading state
    loadingState.classList.add("hidden");
    emptyState.classList.remove("hidden");

    // Show error message
    let errorMessage = "Terjadi kesalahan saat mengklasifikasi gambar.";
    if (error.message.includes("Failed to fetch")) {
      errorMessage += " Pastikan server backend berjalan di port 5000.";
    } else if (error.message.includes("HTTP error")) {
      errorMessage += " Server memberikan response error.";
    }

    alert(errorMessage + " Silakan coba lagi.");
  }
}

function displayResults(type, confidenceLevel) {
  const normalizedType = type.toLowerCase();
  const waste = wasteDatabase[normalizedType];

  // Hide loading, show results
  loadingState.classList.add("hidden");
  results.classList.remove("hidden");

  if (!waste) {
    console.warn(`Label '${type}' tidak ditemukan dalam database`);

    // Default data untuk label yang tidak dikenal
    const defaultWaste = {
      category: "Tidak Diketahui",
      description: `Jenis sampah "${type}" belum terdaftar dalam database kami. Silakan konsultasikan dengan ahli pengelolaan sampah.`,
      managementTips: [
        "• Konsultasikan dengan ahli pengelolaan sampah",
        "• Periksa panduan pengelolaan sampah daerah",
        "• Hubungi dinas lingkungan setempat",
      ],
      impact:
        "Dampak terhadap lingkungan belum diketahui, perlu penelitian lebih lanjut.",
    };

    // Update content dengan data default
    wasteType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    wasteCategory.textContent = `Kategori: ${defaultWaste.category}`;
    confidence.textContent = `${confidenceLevel}%`;
    description.textContent = defaultWaste.description;
    environmentalImpact.textContent = defaultWaste.impact;
    managementTips.innerHTML = defaultWaste.managementTips.join("<br>");
  } else {
    // Update content dengan data dari database
    wasteType.textContent =
      normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
    wasteCategory.textContent = `Kategori: ${waste.category}`;
    confidence.textContent = `${confidenceLevel}%`;
    description.textContent = waste.description;
    environmentalImpact.textContent = waste.impact;
    managementTips.innerHTML = waste.managementTips.join("<br>");
  }

  // Animation
  results.style.opacity = "0";
  results.style.transform = "translateY(20px)";
  results.style.transition = "all 0.5s ease";

  requestAnimationFrame(() => {
    results.style.opacity = "1";
    results.style.transform = "translateY(0)";
  });
}

// Interactive effects
document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".grid.md\\:grid-cols-3 > div").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
});

// Hover effects
document.querySelectorAll("button, label").forEach((element) => {
  element.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05)";
  });

  element.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });
});
