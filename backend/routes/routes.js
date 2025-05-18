const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
require('dotenv').config();
const ModelGenerator = require('./modelGenerator');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const modelGenerator = new ModelGenerator();

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEY_PATH,
});

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GCLOUD_KEY_PATH,
});

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

// Error handler
const handleVisionError = (error, res, source = 'Google Cloud Vision') => {
  console.error(`❌ ${source} Error:`, error);
  const statusCode = error.code || error.response?.status || 500;
  const errorMessage = error.message || 'Internal server error';

  return res.status(statusCode).json({
    error: errorMessage,
    details: error.errors || error.response?.data || {}
  });
};

// GCS Upload helper
async function uploadToGCS(buffer, filename) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);
  await file.save(buffer, {
    metadata: { contentType: 'image/jpeg' }
  });
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
  });
  return signedUrl;
}

// Main image analysis endpoint (in-memory buffer)
router.post('/analyze-image', upload.single('file'), async (req, res) => {
  const { buffer } = req.file || {};
  if (!buffer) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    // Object localization
    const [objectResult] = await client.objectLocalization({
      image: { content: buffer }
    });
    let objects = objectResult.localizedObjectAnnotations || [];

    console.log('🔍 Vision API Raw Response:', {
      objectCount: objects.length,
      sample: objects[0]?.name || 'No objects'
    });

    // Fallback to label detection if nothing found
    if (!objects.length) {
      console.log('🔄 Falling back to label detection');
      const [labelResult] = await client.labelDetection({
        image: { content: buffer }
      });
      objects = labelResult.labelAnnotations.map(label => ({
        name: label.description,
        score: label.score,
        boundingPoly: null
      }));
    }

    // Generate model
    const modelData = modelGenerator.generateModelFromObjects(objects);

    res.json({ objects, modelData });
  } catch (error) {
    handleVisionError(error, res);
  }
});

// Image analysis via GCS
router.post('/analyze-image-from-storage', upload.single('file'), async (req, res) => {
  const { buffer } = req.file || {};
  if (!buffer) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    // Upload to GCS and get public URL
    const filename = `image-${Date.now()}-${Math.random().toString(36).substr(2, 7)}.jpg`;
    const imageUrl = await uploadToGCS(buffer, filename);

    // Object localization using URI
    const [objectResult] = await client.objectLocalization({
      image: { source: { imageUri: imageUrl } }
    });
    const objects = objectResult.localizedObjectAnnotations || [];

    console.log('🔍 Vision API (from GCS) Response:', {
      objectCount: objects.length,
      sample: objects[0]?.name || 'No objects'
    });

    // If no objects, return default model
    if (!objects.length) {
      return res.json({
        objects: [],
        modelData: modelGenerator.generateDefaultModel(),
        imageUrl
      });
    }

    // Generate model
    const modelData = modelGenerator.generateModelFromObjects(objects);

    res.json({ objects, modelData, imageUrl });
  } catch (error) {
    handleVisionError(error, res);
  }
});

module.exports = router;
