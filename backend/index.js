const express = require('express');
const cors = require('cors'); // for handling CORS
const morgan = require('morgan'); // Added for logging

require('dotenv').config(); // Load environment variables

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS (for development)
app.use(express.json()); // To parse JSON bodies
app.use(morgan('dev')); // Use Morgan for logging HTTP requests

// Mount the routes
app.use('/api', require('./routes/routes')); // Mount the routes

// Error handling middleware (added after route definitions)
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  // Customize the error response as needed
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
