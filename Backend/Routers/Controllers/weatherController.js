

import axios from 'axios'
import Weather from "../../Model/weather.js";

const fetchWeather = async (req, res) => {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
    const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

    try {
        const { location, startDate, endDate } = req.body;

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ success: false, message: "Invalid date range" });
        }

        // Fetch current weather data
        const weatherResponse = await axios.get(`${weatherUrl}${location}&appid=${WEATHER_API_KEY}`);
        const weatherData = weatherResponse.data;

        if (weatherData.cod === "404") {
            return res.status(404).json({ success: false, message: "City not found" });
        }

        // Fetch forecast data
        const forecastResponse = await axios.get(`${forecastUrl}${location}&appid=${WEATHER_API_KEY}`);
        const forecastData = forecastResponse.data.list;
        // Convert dates to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);

        const dailyWeather = [];
        const dateSet = new Set();

        forecastData.forEach((day) => {
            const forecastDate = new Date(day.dt_txt);
            const forecastDay = forecastDate.toISOString().split("T")[0];
            console.log("dates are", forecastDate)

            if (forecastDate >= start && forecastDate <= end) {

                if (!dateSet.has(forecastDay) && forecastDate.getUTCHours() === 12) {
                    dateSet.add(forecastDay);
                    dailyWeather.push({
                        date: forecastDate,
                        weatherType: day.weather[0].main.toLowerCase(),
                        temperature: day.main.temp,
                    });
                }
            }
        });


        const lastRecord = await Weather.findOne().sort({ id: -1 });
        const newId = lastRecord ? lastRecord.id + 1 : 1;

        // Create a new weather entry
        const weatherEntry = new Weather({
            id: newId,
            location: weatherData.name,
            temperature: weatherData.main.temp,
            weather: weatherData.weather[0].description,
            windSpeed: weatherData.wind.speed,
            humidity: weatherData.main.humidity,
            visibility: weatherData.visibility / 1000,
            pressure: weatherData.main.pressure,
            startDate: start,
            endDate: end,
            dailyWeather: dailyWeather,
        });

        // Save data to the database
        await weatherEntry.save();
        console.log("data stored", location)
        // Send response
        res.status(200).json({
            success: true,
            message: "Weather data stored successfully",
            data: weatherEntry,
        });

    } catch (error) {
        console.error("Error fetching weather:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Get all stored city names
const fetchData = async (req, res) => {
    try {
        // Fetch city names with their MongoDB _id
        const cities = await Weather.find()  // ✅ Correct field and optimized

      

        res.status(200).json({ success: true, cities });
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const dataUpdate = async (req, res) => {

    try {
        const { id } = req.params; // Get the ID from request parameters
        const updateData = req.body; // Get update data from request body

        // Check if the record exists
        const weatherEntry = await Weather.findById(id);
        if (!weatherEntry) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        await Weather.findByIdAndDelete(id);
        const updatedWeather = await fetchWeather(location, startDate, endDate);
        if (!updatedWeather.success) {
            return res.status(400).json({ success: false, message: updatedWeather.message });
        }

        return res.status(200).json({ success: true, message: "Data updated successfully", data: updatedWeather.data });
    } catch (error) {
        console.error("Error updating data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


const dataDelete = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from request parameters

        const weatherEntry = await Weather.findById(id);
        if (!weatherEntry) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        // Delete the record
        await Weather.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Data deleted successfully" });
    } catch (error) {
        console.error("Error deleting data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

const cityFetch = async (req, res) => {
    try {
        const { id } = req.params; // Get the city ID from the request parameters
        console.log("id:",id)
        if (!id) {
            return res.status(400).json({ success: false, message: "City ID is required" });
        }
        // Find the weather entry by ID
        const cityData = await Weather.findById(id);

        if (!cityData) {
            return res.status(404).json({ success: false, message: "City not found" });
        }

        res.status(200).json({ success: true, data: cityData });
    } catch (error) {
        console.error("Error fetching city data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }

}

export { fetchWeather, fetchData, dataUpdate, dataDelete, cityFetch }