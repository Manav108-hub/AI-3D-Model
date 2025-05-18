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
    try {
        await file.save(buffer, {
            metadata: { contentType: 'image/jpeg' }
        });
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60
        });
        return signedUrl;
    } catch (error) {
        console.error('❌ GCS Upload Error:', error);
        throw error;
    }
}

// Main image analysis endpoint
router.post('/analyze-image', upload.single('file'), async (req, res) => {
    const { buffer } = req.file;
    
    if (!buffer) {
        return res.status(400).json({ error: 'No file provided' });
    }

    try {
        // First try object detection
        const [objectResult] = await client.objectDetection(buffer);
        let objects = objectResult.localizedObjectAnnotations || [];
        
        // Log raw API response for debugging
        console.log('🔍 Vision API Raw Response:', JSON.stringify({
            objectCount: objects.length,
            sample: objects[0]?.name || 'No objects found'
        }, null, 2));

        // If no meaningful objects found, fallback to label detection
        if (!objects.length || objects[0]?.name === 'Example Object') {
            console.log('🔄 Falling back to label detection');
            const [labelResult] = await client.labelDetection(buffer);
            const labels = labelResult.labelAnnotations || [];
            
            // Convert labels to object format
            objects = labels.map(label => ({
                name: label.description,
                score: label.score,
                boundingPoly: null
            }));
        }

        // Extract primary object and generate model
        const modelData = modelGenerator.generateModelFromObjects(objects);
        
        // Return response
        res.json({
            objects: objects,
            modelData: modelData
        });
    } catch (error) {
        handleVisionError(error, res, 'Google Cloud Vision');
    }
});

router.post('/analyze-image-from-storage', upload.single('file'), async (req, res) => {
    const { buffer } = req.file;
    if (!buffer) {
        return res.status(400).json({ error: 'No file provided' });
    }
    try {
        const filename = `image-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const imageUrl = await uploadToGCS(buffer, filename);
        const [result] = await client.objectDetection(imageUrl);
        const objects = result.localizedObjectAnnotations;

        console.log('Vision API Response (Object Detection from Storage):', JSON.stringify(result, null, 2)); // Add this line

         if (!objects) { // Check if objects is undefined or null
            console.warn("⚠️  Vision API returned no objects.");
            return res.status(200).json({  // Return a successful empty response
                objects: [],
                modelData: modelGenerator.generateDefaultModel(),
                imageUrl: imageUrl
            });
        }

        const modelData = modelGenerator.generateModelFromObjects(objects);
        res.json({
            labels: objects,
            modelData: modelData,
            imageUrl: imageUrl
        });
    } catch (error) {
        handleVisionError(error, res, 'Google Cloud Vision');
    }
});

module.exports = router;
