import mongoose from "mongoose";
const dailyWeatherSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  weatherType: { type: String, required: true }, // e.g., "clear", "cloudy", "snow"
  temperature: { type: Number, required: true }, // Temperature for that day
});

const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required: true }, // Current temperature
  weather:{type:String,required:true},
  windSpeed: { type: Number, required: true },
  humidity: { type: Number, required: true },
  visibility: { type: Number, required: true }, // in km
  pressure: { type: Number, required: true }, // in mb
  startDate: { type: Date, required: true }, // Start date of weather tracking
  endDate: { type: Date, required: true }, // End date of weather tracking
  dailyWeather: [dailyWeatherSchema], // Stores weather type and temp for each day
});

const Weather = mongoose.model("Weather", weatherSchema);

export default Weather