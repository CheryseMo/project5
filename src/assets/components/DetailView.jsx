import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = "2082a6d067ae45d6a147cfbc6c5bf12e";

function DetailView() {
  const { timestamp } = useParams(); // timestamp_local from the URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default location — you could enhance this to fetch from global app state
  const location = {
    lat: 51.5074, // London
    lon: -0.1278,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${location.lat}&lon=${location.lon}&key=${API_KEY}`;
        const response = await axios.get(url);
        const matched = response.data.data.find(
          (entry) => entry.timestamp_local === decodeURIComponent(timestamp)
        );
        setItem(matched);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timestamp]);

  if (loading) {
    return <p>Loading weather details...</p>;
  }

  if (!item) {
    return (
      <div className="left-container">
        <p>No weather data found for this timestamp. <Link to="/">Go back to Dashboard</Link></p>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="left-container">
        <h1>Weather Details</h1>
        <Link to="/">← Back to Dashboard</Link>
      </div>

      <div className="right-container">
        <h2>{new Date(item.timestamp_local).toLocaleString()}</h2>
        <p><strong>🌡 Temperature:</strong> {item.temp}°C</p>
        <p><strong>🌥 Condition:</strong> {item.weather.description}</p>
        <p><strong>💧 Humidity:</strong> {item.rh}%</p>
        <p><strong>🌬 Wind Speed:</strong> {item.wind_spd.toFixed(1)} m/s</p>
        <p><strong>🧭 Wind Direction:</strong> {item.wind_cdir_full}</p>
        <p><strong>☁ Cloud Coverage:</strong> {item.clouds}%</p>
        <p><strong>🔆 Solar Radiation:</strong> {item.solar_rad} W/m²</p>
        <p><strong>🕶 UV Index:</strong> {item.uv}</p>
        <p><strong>📏 Pressure:</strong> {item.pres} mb</p>
        <p><strong>📍 Latitude:</strong> {item.lat}</p>
        <p><strong>📍 Longitude:</strong> {item.lon}</p>
      </div>
    </div>
  );
}

export default DetailView;
