import React from "react";
import "../Pages/Home.css";

const WeatherCard = ({ weatherData, getWeatherIcon }) => {
  if (!weatherData) return null;

  return (
    <div className="weather-card fade-in">
      <div className="weather-header">
        <h2 className="city-name">{weatherData.location}</h2>
        <p className="temperature">{Math.round(weatherData.temperature)}°C</p>
      </div>
      
      <img 
        src={getWeatherIcon(weatherData.weather)} 
        alt="Weather Icon" 
        className="weather-icon" 
      />
      <p className="weather-desc">{weatherData.weather}</p>

      <div className="weather-details">
        <div className="detail">
          <p className="detail-title">Wind Speed</p>
          <p>{weatherData.windSpeed} km/h</p>
        </div>
        <div className="detail">
          <p className="detail-title">Humidity</p>
          <p>{weatherData.humidity}%</p>
        </div>
        <div className="detail">
          <p className="detail-title">Visibility</p>
          <p>{weatherData.visibility} km</p>
        </div>
        <div className="detail">
          <p className="detail-title">Pressure</p>
          <p>{weatherData.pressure} mb</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
