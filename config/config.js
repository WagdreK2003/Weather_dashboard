require('dotenv').config();
module.exports = {
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/weather-dashboard'
};
