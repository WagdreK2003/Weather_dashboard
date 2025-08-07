const axios = require('axios');
const Weather = require('../models/model');
const { WEATHER_API_KEY } = require('../config/config');

// Add weather data by fetching from OpenWeatherMap API
const addWeather = async (req, res) => {
  try {
    console.log("addWeather route hit");
    const { city } = req.body;

    if (!city) return res.status(400).send({ error: "City is required" });

    // Call OpenWeather API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const temperature = response.data.main.temp;
    const description = response.data.weather[0].description;

    // Save to MongoDB
    const newWeather = new Weather({ city, temperature, description });
    await newWeather.save();

    res.send("Weather data has been saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch or save weather data" });
  }
};

// Display all weather record
 const displayWeather = async (req, res) => {
  const city = req.params.city; // Changed from req.query.city to req.params.city

  if (!city) {
    return res.status(400).send({ error: "City parameter is required" });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(apiUrl); // Changed from fetch to axios
    const data = response.data; // Changed from response.json() to response.data

    if (data.cod !== 200) {
      return res.status(404).send({ error: "City not found" });
    }

    const weatherInfo = {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description
    };

    res.status(200).json(weatherInfo);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error fetching weather data" });
  }
};
// ...existing code...
const getAllWeather = async (req, res) => {
  try {
    const records = await Weather.find().sort({ searchedAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
};
// ...existing code...
const bulkInsertWeather = async (req, res) => {
  try {
    const records = req.body; // should be an array of objects
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Provide an array of weather records" });
    }
    await Weather.insertMany(records);
    res.json({ message: "Records inserted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Bulk insert failed" });
  }
};
// ...existing code...
module.exports = { addWeather, displayWeather, getAllWeather, bulkInsertWeather };



