import { useEffect, useState } from "react";
import "./Sidebar.css";
import axios from "axios";
import images from "../assets/images";

const Sidebar = ({ setWeatherData, setForeCastData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [allCities, setCities] = useState([]);
  const API_BASE_URL = "http://localhost:5000/api/weather";

  useEffect(() => {
    fetchSavedCities();
  })

  const fetchSavedCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities`);

      setCities(response.data.cities);
    
    } catch (error) {
      console.error("Error fetching saved cities:", error);
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

  const onCitySelect = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/city/${id}`)
     console.log("city id:",id)
      const data = response.data
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
        })))
    }
    catch (error) {
      console.log("Error while fetching city!")
    }
  };

  const deleteCity = async (cityId) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${cityId}`);
      fetchSavedCities(); // Refresh the city list after deletion
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(true)}>☰</button>

      <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={() => setIsOpen(false)}></div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
        <h2 className="sidebar-title">Saved Cities</h2>

        {allCities && allCities.length > 0 ? (
          <ul>
            {allCities.map((city) => (
              <li key={city.id} className="city-item" onClick={() => onCitySelect(city._id)}>
                <span className="item">{city.location}</span>
                <button className="delete-btn" onClick={() => deleteCity(city._id)}>   🗑</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-cities">No saved cities</p>
        )}
      </div>
    </>
  );
};

export default Sidebar;
