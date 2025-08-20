const axios = require('axios');
const Weather = require('../models/model');
const { WEATHER_API_KEY } = require('../config/config');

// Add weather data by fetching from OpenWeatherMap API
// This function handles the POST /api/weather route
const addWeather = async (req, res) => {
  try {
    const { city, temp, condition } = req.body;
    
    // Save to MongoDB with the correct field names
    const newWeather = new Weather({ 
      city, 
      temperature: temp, 
      description: condition 
    });
    
    await newWeather.save();

    res.status(201).json({ message: "Weather data has been saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save weather data" });
  }
};

// Fetch live weather data from OpenWeatherMap API
const displayWeather = async (req, res) => {
  try {
    const city = req.params.city;

    // Correctly placed console.log statements
    console.log('Attempting to fetch with API Key:', WEATHER_API_KEY);
    console.log('City:', city);

    if (!city) {
      return res.status(400).send({ error: "City parameter is required" });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    // Log the full URL after it has been created
    console.log('Full API URL:', apiUrl);

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.cod !== 200) {
      return res.status(404).send({ error: "City not found" });
    }

    // Returning the full data object so the front end can get all info
    // The previous front-end code expects the full object, not a filtered one.
    res.status(200).json(data); 
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error fetching weather data" });
  }
};

// Display all weather records
const getAllWeather = async (req, res) => {
  try {
    const records = await Weather.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

// Bulk insert weather records
const bulkInsertWeather = async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Provide an array of weather records" });
    }
    await Weather.insertMany(records);
    res.status(201).json({ message: "Records inserted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Bulk insert failed" });
  }
};

module.exports = { addWeather, displayWeather, getAllWeather, bulkInsertWeather };