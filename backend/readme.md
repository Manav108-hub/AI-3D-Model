# 🧠 Image Analyzer & Model Generator (Node.js)

This backend project analyzes images using Google Cloud Vision API and generates a basic model structure based on recognized objects. It supports uploading images in-memory or storing them in Google Cloud Storage before analysis.

> Supports object-based model generation for: **vase**, **chair**, **cushion**, and **lamp**.

---

## 🚀 Features

- 📸 Upload and analyze images via POST request
- 🧠 Uses Google Cloud Vision to detect objects
- 📦 Uploads files to Google Cloud Storage
- 🔁 Fallbacks to label detection if object detection fails
- 🪑 Returns structured 3D model data from recognized objects

---

## 🔧 Tech Stack

- **Node.js** (CommonJS)
- **Express.js**
- **Google Cloud Vision API**
- **Google Cloud Storage**
- **Multer** (in-memory image handling)
- **dotenv** for environment config

---

## 📁 Supported Model Types

| Model Type | Detected Object Trigger       |
|------------|-------------------------------|
| 🏺 Vase     | Detected object: `vase`       |
| 🪑 Chair    | Detected object: `chair`      |
| 🛋️ Cushion  | Detected object: `cushion`    |
| 💡 Lamp     | Detected object: `lamp`       |

> These are handled in `modelGenerator.generateModelFromObjects()`.

---

## 📦 Installation

```bash
git clone https://github.com/your-username/your-repo-name.git
cd backend
npm install

⚙️ Environment Variables (.env)
Create a .env file in your root:

env

GCLOUD_PROJECT_ID=your-gcp-project-id
GCLOUD_STORAGE_BUCKET=your-bucket-name
GCLOUD_CLIENT_EMAIL=your-service-account-email
GCLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEv...\\n-----END PRIVATE KEY-----\\n"

▶️ Running the Server
node index.js
The server listens on port 5000 by default.

📡 API Endpoints
🔍 POST /api/analyze-image
Description: Analyze image in-memory (not saved to bucket)

Body: multipart/form-data with a field named file

Returns: Detected objects and generated model data


curl -X POST http://localhost:5000/api/analyze-image \
  -F "file=@./images/chair.jpg"
☁️ POST /api/analyze-image-from-storage
Description: Upload image to GCS and analyze via public URL

Body: multipart/form-data with a field named file

Returns: Detected objects, model data, and GCS image URL

curl -X POST http://localhost:5000/api/analyze-image-from-storage \
  -F "file=@./images/lamp.jpg"
🛠️ Development Notes
Handles both direct buffer input and GCS-hosted image URLs

If object detection fails, label detection is used as fallback

Uses @google-cloud/vision and @google-cloud/storage with in-code credentials from .env file (not .json)

🧪 Example Output (for a vase image)
{
  "objects": [
    {
      "name": "vase",
      "score": 0.92
    }
  ],
  "modelData": {
    "type": "vase",
    "material": "ceramic",
    "dimensions": { "height": 30, "width": 15 }
  }
}


📜 License
MIT License

👤 Author
Made with ❤️ by Manav Adwani