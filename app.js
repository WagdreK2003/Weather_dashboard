const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Added for serving static files correctly
const weatherRoutes = require('./routes/routes');

// 1. Load environment variables first
require('dotenv').config();

// 2. Import configuration AFTER dotenv is loaded
const { PORT, MONGO_URL, WEATHER_API_KEY } = require('./config/config');

const app = express();

// Log the API Key (for debugging only, remove in production)
console.log('WEATHER_API_KEY from config:', WEATHER_API_KEY);

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))  
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json()); // To parse JSON bodies from POST requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies (if needed)

// Serve static files (your index.html, CSS, JS, images)
// This makes files in the 'public' directory accessible directly
app.use(express.static(path.join(__dirname, 'public')));

// Mount weather routes
// CRITICAL: Mount directly without a prefix so that front-end URLs match
// /api/weather, /all, /weather/:city directly map
app.use('/', weatherRoutes); 

// Example root route to serve your index.html if public is not configured or for testing
// Alternatively, if 'public' folder contains index.html, the static middleware handles it.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});