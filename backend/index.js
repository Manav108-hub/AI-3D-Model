        const express = require('express');
        const multer = require('multer');
        const cors = require('cors'); //  for handling CORS

        const app = express();
        const port = 5000;

        app.use(cors()); // Enable CORS (for development)
        // Set up multer for handling file uploads
        const storage = multer.memoryStorage(); // Store the file in memory
        const upload = multer({ storage: storage });

        // Route to handle image analysis
        app.post('/api/analyze-image', upload.single('file'), (req, res) => {
          // req.file contains the uploaded image data
          if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
          }

          //  Simulate image analysis (replace with your actual logic)
          console.log('Received image:', req.file.originalname);
          //  You would send req.file.buffer to your GCP or AI service here

          // Simulate a successful analysis and model generation
          const analysisResult = {
            labels: [{ description: 'Example Object', score: 0.85 }], // Example
          };
          const modelData = {
            geometry: 'cube',
            material: 'plastic',
            color: '#FF0000',
          };

          // Send the analysis result and model data back to the client
          res.json({ labels: analysisResult.labels, modelData: modelData });
        });

        app.listen(port, () => {
          console.log(`Server listening on port ${port}`);
        });
        