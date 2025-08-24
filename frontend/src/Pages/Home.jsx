import React, { useState, useEffect } from "react";
import axios from "axios";
import images from "../assets/images";
import WeatherCard from "../components/WeatherCard";
import ForeCastCard from "../Components/ForeCastCard";
import "./Home.css";
import Sidebar from "../Components/Sidebar";

const Home = () => {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
          );

          if (weatherResponse.data.cod !== 200) {
            setError("Error fetching location weather");
            return;
          }

          setWeatherData({
            location: weatherResponse.data.name,
            temperature: weatherResponse.data.main.temp,
            weather: weatherResponse.data.weather[0].description,
            windSpeed: weatherResponse.data.wind.speed,
            humidity: weatherResponse.data.main.humidity,
            visibility: weatherResponse.data.visibility / 1000,
            pressure: weatherResponse.data.main.pressure,
          });

          const forecastResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
          );

          const foredata = forecastResponse.data.list
            .filter((_, index) => index % 8 === 0)
            .slice(0, 7);

          setForecastData(
            foredata.map((day) => ({
              date: new Date(day.dt_txt).toLocaleDateString(),
              weatherType: getWeatherIcon(day.weather[0].description),
              temperature: Math.round(day.main.temp),
            }))
          );

          setCity(weatherResponse.data.name);
          setError(null);
        } catch (err) {
          setError("Could not fetch location weather.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permission denied for location access.");
        setLoading(false);
      }
    );
  };

  const fetchWeather = async () => {
    if (!city || !startDate || !endDate) {
      setError("Please enter a city and select start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Invalid date range");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/weather/fetch-weather",
        { location: city, startDate, endDate },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (!data.success) {
        setError(data.message || "City not found");
        return;
      }

      setWeatherData({
        location: data.data.location,
        temperature: data.data.temperature,
        weather: data.data.weather || "unknown",
        windSpeed: data.data.windSpeed,
        humidity: data.data.humidity,
        visibility: data.data.visibility,
        pressure: data.data.pressure,
      });

      setForecastData(
        data.data.dailyWeather.map((day) => ({
          date: new Date(day.date).toLocaleDateString(),
          weatherType: getWeatherIcon(day.weatherType),
          temperature: Math.round(day.temperature),
        }))
      );
    } catch (err) {
      setError("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description) => {
    description = description.toLowerCase();
    if (description.includes("clear sky")) return images.clear;
    if (description.includes("cloud")) return images.clouds;
    if (description.includes("rain")) return images.rain;
    if (description.includes("drizzle")) return images.drizzle;
    if (description.includes("mist")) return images.mist;
    if (description.includes("wind")) return images.wind;
    if (description.includes("snow")) return images.snow;
    return images.mist;
  };

  return (
    <div className="home-container">
      <Sidebar setWeatherData={setWeatherData} setForecastData={setForecastData}/>
      <div className="weather-app">
        {/* Header Section */}
        <div className="app-header">
          <h1 className="title">Weather Forecast</h1>
          <p className="subtitle">Get accurate weather information for any location</p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="search-input"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
            <button 
              onClick={fetchWeather} 
              className="search-button"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading && !weatherData && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        <WeatherCard weatherData={weatherData} getWeatherIcon={getWeatherIcon} />
        <ForeCastCard forecastData={forecastData} />
      </div>
    </div>
  );
};

export default Home;
