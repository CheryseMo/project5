import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const API_KEY = "2082a6d067ae45d6a147cfbc6c5bf12e";

const locations = [
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
];

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tempFilter, setTempFilter] = useState("");
  const [weatherFilter, setWeatherFilter] = useState("");
  const [tempRange, setTempRange] = useState([0, 40]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [tempUnit, setTempUnit] = useState("Celsius");
  const [showCharts, setShowCharts] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&key=${API_KEY}`;
      const response = await axios.get(url);
      setData(response.data.data.slice(0, 10));
    };
    fetchData();
  }, [selectedLocation]);

  const convertToFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);

  const filteredData = data
    .filter((item) =>
      item.timestamp_local
        .toLocaleString()
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((item) => (tempFilter ? item.temp >= parseInt(tempFilter) : true))
    .filter((item) =>
      weatherFilter
        ? item.weather.description.toLowerCase() === weatherFilter.toLowerCase()
        : true
    )
    .filter((item) => item.temp >= tempRange[0] && item.temp <= tempRange[1])
    .slice(0, 15);

  const chartData = data.map((item) => ({
    time: new Date(item.timestamp_local).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temp: tempUnit === "Celsius" ? item.temp : convertToFahrenheit(item.temp),
    weather: item.weather.description,
  }));

  const weatherCounts = data.reduce((acc, item) => {
    const weather = item.weather.description;
    acc[weather] = (acc[weather] || 0) + 1;
    return acc;
  }, {});
  const weatherChartData = Object.entries(weatherCounts).map(([key, value]) => ({
    weather: key,
    count: value,
  }));

  return (
    <div className="App">
      <div className="left-container">
        <h1>Weather Dashboard</h1>

        <label>Select Location: </label>
        <select
          value={selectedLocation.name}
          onChange={(e) =>
            setSelectedLocation(locations.find((l) => l.name === e.target.value))
          }
        >
          {locations.map((location) => (
            <option key={location.name}>{location.name}</option>
          ))}
        </select>

        <div className="temperature-unit-toggle">
          <label>
            <input
              type="radio"
              value="Celsius"
              checked={tempUnit === "Celsius"}
              onChange={() => setTempUnit("Celsius")}
            />
            Celsius
          </label>
          <label>
            <input
              type="radio"
              value="Fahrenheit"
              checked={tempUnit === "Fahrenheit"}
              onChange={() => setTempUnit("Fahrenheit")}
            />
            Fahrenheit
          </label>
        </div>

        <input
          type="text"
          placeholder="Search by Time..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setTempFilter(e.target.value)}>
          <option value="">Select Temperature Filter</option>
          <option value="0">Above 0°C</option>
          <option value="10">Above 10°C</option>
          <option value="20">Above 20°C</option>
        </select>

        <div className="weather-condition-filter">
          {["", "clear sky", "cloudy", "rain"].map((w) => (
            <label key={w || "none"}>
              <input
                type="radio"
                name="weatherFilter"
                value={w}
                checked={weatherFilter === w}
                onChange={(e) => setWeatherFilter(e.target.value)}
              />
              {w === "" ? "No Filter" : w}
            </label>
          ))}
        </div>

        <label>Temperature Range: </label>
        <input
          type="range"
          min="0"
          max="40"
          value={tempRange[0]}
          onChange={(e) =>
            setTempRange([parseInt(e.target.value), tempRange[1]])
          }
        />
        <input
          type="range"
          min="0"
          max="40"
          value={tempRange[1]}
          onChange={(e) =>
            setTempRange([tempRange[0], parseInt(e.target.value)])
          }
        />
        <div>
          Range: {tempRange[0]}°C - {tempRange[1]}°C
        </div>

        <button onClick={() => setShowCharts(!showCharts)}>
          {showCharts ? "Hide Charts" : "Show Charts"}
        </button>
      </div>

      <div className="right-container">
        <h2>Forecast Table</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Temp</th>
              <th>Weather</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/details/${item.timestamp_local}`}>
                    {new Date(item.timestamp_local).toLocaleString()}
                  </Link>
                </td>
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

        {showCharts && (
          <>
            <h2>Temperature Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

            <h2>Weather Condition Frequency</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weatherChartData}>
                <XAxis dataKey="weather" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
