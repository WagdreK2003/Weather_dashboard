const express = require('express');
const app = express();
const weatherRoutes = require('./routes/routes');
const {PORT, MONGO_URL} = require('./config/config');
const mongoose = require('mongoose');
// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))   
  .catch(err => console.error('MongoDB connection error:', err));
  

// Middleware
app.use(express.json());

// ...existing code...
app.use(express.static('public'));
// ...existing code...

const dotenv = require("dotenv");
dotenv.config();

// Mount weather routes
app.use('/weather', weatherRoutes);

app.get("/", (req, res) => {
  res.send("welcome");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

