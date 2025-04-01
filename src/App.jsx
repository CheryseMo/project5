import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "2082a6d067ae45d6a147cfbc6c5bf12e"; 

// Pre-defined list of locations with their latitude and longitude
const locations = [
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 }
];

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(""); // Search term
  const [tempFilter, setTempFilter] = useState(""); // Temperature dropdown filter
  const [weatherFilter, setWeatherFilter] = useState(""); // Weather condition filter
  const [tempRange, setTempRange] = useState([0, 40]); // Slider range filter for temperature
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]); // Default location: London
  const [tempUnit, setTempUnit] = useState("Celsius"); // Default to Celsius

  // Fetch weather data for the selected location
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&key=${API_KEY}`
        );
        setData(response.data.data.slice(0, 50)); // Fetch first 50 items
        setIsLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedLocation]); // Re-fetch data when the selected location changes

  // Temperature conversion function
  const convertToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32); // Convert to Fahrenheit and round
  };

  // Filtered data based on search, dropdown, radio button, and slider values
  const filteredData = data
    .filter((item) =>
      item.timestamp_local
        .toLocaleString()
        .toLowerCase()
        .includes(search.toLowerCase()) // Search by date/time
    )
    .filter((item) =>
      tempFilter ? item.temp >= parseInt(tempFilter) : true
    )
    .filter((item) =>
      weatherFilter ? item.weather.description.toLowerCase() === weatherFilter.toLowerCase() : true
    )
    .filter((item) => item.temp >= tempRange[0] && item.temp <= tempRange[1])
    .slice(0, 15); // Show only 15 rows

  return (
    <div className="App">
      {/* Left container */}
      <div className="left-container">
        <h1>Weather Dashboard</h1>

        {/* Location Selector */}
        <div className="location-selector">
          <label htmlFor="location">Select Location: </label>
          <select
            id="location"
            onChange={(e) => {
              const selected = locations.find(
                (location) => location.name === e.target.value
              );
              setSelectedLocation(selected);
            }}
            value={selectedLocation.name}
          >
            {locations.map((location) => (
              <option key={location.name} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature Unit Toggle */}
        <div className="temperature-unit-toggle">
          <label htmlFor="celsius">Celsius</label>
          <input
            type="radio"
            id="celsius"
            name="tempUnit"
            value="Celsius"
            checked={tempUnit === "Celsius"}
            onChange={() => setTempUnit("Celsius")}
          />
          <label htmlFor="fahrenheit">Fahrenheit</label>
          <input
            type="radio"
            id="fahrenheit"
            name="tempUnit"
            value="Fahrenheit"
            checked={tempUnit === "Fahrenheit"}
            onChange={() => setTempUnit("Fahrenheit")}
          />
        </div>

        {/* Loading and Error Handling */}
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Time..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Temperature Filter (Dropdown) */}
        <select onChange={(e) => setTempFilter(e.target.value)}>
          <option value="">Select Temperature Filter</option>
          <option value="0">Above 0°C</option>
          <option value="10">Above 10°C</option>
          <option value="20">Above 20°C</option>
        </select>

        {/* Weather Condition Filter (Radio Buttons) */}
        <div className="weather-condition-filter">
          <label>
            <input
              type="radio"
              name="weatherFilter"
              value=""
              checked={weatherFilter === ""}
              onChange={(e) => setWeatherFilter(e.target.value)}
            />
            No Filter
          </label>
          <label>
            <input
              type="radio"
              name="weatherFilter"
              value="clear sky"
              checked={weatherFilter === "clear sky"}
              onChange={(e) => setWeatherFilter(e.target.value)}
            />
            Clear Sky
          </label>
          <label>
            <input
              type="radio"
              name="weatherFilter"
              value="cloudy"
              checked={weatherFilter === "cloudy"}
              onChange={(e) => setWeatherFilter(e.target.value)}
            />
            Cloudy
          </label>
          <label>
            <input
              type="radio"
              name="weatherFilter"
              value="rain"
              checked={weatherFilter === "rain"}
              onChange={(e) => setWeatherFilter(e.target.value)}
            />
            Rain
          </label>
        </div>

        {/* Temperature Range Slider */}
        <div className="temperature-range-slider">
          <label htmlFor="tempRange">Temperature Range: </label>
          <br></br><input
            type="range"
            id="tempRange"
            min="0"
            max="40"
            step="1"
            value={tempRange[0]}
            onChange={(e) => setTempRange([parseInt(e.target.value), tempRange[1]])}
          />
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={tempRange[1]}
            onChange={(e) => setTempRange([tempRange[0], parseInt(e.target.value)])}
          />
          <div>Range: {tempRange[0]}°C - {tempRange[1]}°C</div>
        </div>
      </div>

      {/* Right container */}
      <div className="right-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Temperature</th>
              <th>Weather</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.timestamp_local).toLocaleString()}</td>
                <td>
                  {tempUnit === "Celsius"
                    ? `${item.temp}°C`
                    : `${convertToFahrenheit(item.temp)}°F`}
                </td>
                <td>{item.weather.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
