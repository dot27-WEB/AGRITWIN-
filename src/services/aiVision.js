// AI Vision Service for Crop Disease Detection
// Communicates with Node.js + Express backend to keep the Gemini API key secure.

// Keep this helper for backwards compatibility and validation checks
export const getGeminiApiKey = () => {
  return "BACKEND_SECURED"; // Safely bypass frontend checks
};

// Compress image to max 800px width/height to optimize upload performance
export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, "image/jpeg", 0.7); // 70% quality
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const analyzeCropImageApi = async (file) => {
  console.log("========== SECURE BACKEND API CALL ==========");
  console.log("Analyzing crop specimen image via secure backend proxy...");
  console.log("Request Dispatch Time:", new Date().toISOString());

  // Compress before sending
  const compressedFile = await compressImage(file);
  console.log("✓ Specimen image compressed successfully");

  const formData = new FormData();
  formData.append("image", compressedFile);

  const response = await fetch("/api/disease/analyze", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = "AI Disease Detection is temporarily unavailable. Please try again later.";
    try {
      const errJson = JSON.parse(errText);
      if (errJson.error) errMsg = errJson.error;
    } catch (e) {}
    throw new Error(errMsg);
  }

  const report = await response.json();
  console.log("✓ Analysis report successfully fetched from backend:", report);
  return report;
};
