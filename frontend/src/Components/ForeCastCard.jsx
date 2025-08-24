import React from "react";
import "../Pages/Home.css";

const ForeCastCard = ({ forecastData }) => {
  if (forecastData.length === 0) return null;

  return (
    <div className="forecast-container slide-up">
      <h2 className="forecast-title">7-Day Forecast</h2>
      <div className="forecast-grid">
        {forecastData.map((day, index) => (
          <div key={index} className="forecast-card">
            <p className="forecast-date">{day.date}</p>
            <img 
              src={day.weatherType} 
              alt="Weather Icon" 
              className="forecast-icon" 
            />
            <p className="forecast-temp">{day.temperature}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForeCastCard;
