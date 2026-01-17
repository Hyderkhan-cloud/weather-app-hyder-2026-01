/* ================================
   Hyder Weather App – 2026
   ================================ */

const API_KEY = https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

function handleEnter(event) {
  if (event.key === "Enter") {
    getWeather();
  }
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const loading = document.getElementById("loading");
  const weatherIcon = document.getElementById("weatherIcon");
  const weatherResult = document.getElementById("weatherResult");

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  loading.style.display = "block";
  weatherIcon.innerHTML = "";
  weatherResult.innerHTML = "";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) throw new Error("City not found");
      if (response.status === 401) throw new Error("Invalid API key");
      throw new Error("Unable to fetch weather");
    }

    const data = await response.json();
    displayWeather(data);

  } catch (error) {
    showError(error.message);
  } finally {
    loading.style.display = "none";
  }
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);

  document.getElementById("weatherIcon").innerHTML =
    getWeatherIcon(data.weather[0].main, data.weather[0].icon);

  document.getElementById("weatherResult").innerHTML = `
    <strong>📍 ${data.name}, ${data.sys.country}</strong><br><br>
    🌡 Temperature: ${temp}°C (Feels like ${feels}°C)<br>
    ☁ Weather: ${capitalize(data.weather[0].description)}<br>
    💧 Humidity: ${data.main.humidity}%<br>
    🌬 Wind: ${data.wind.speed} m/s<br>
    🔽 Pressure: ${data.main.pressure} hPa
  `;
}

function getWeatherIcon(condition, iconCode) {
  const c = condition.toLowerCase();

  if (iconCode.includes("n")) return "🌙";
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("drizzle")) return "🌦️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "🌫️";
  if (c.includes("clear")) return "☀️";

  return "🌈";
}

function showError(message) {
  document.getElementById("weatherIcon").innerHTML = "⚠️";
  document.getElementById("weatherResult").innerHTML =
    `<span class="error">❌ ${message}</span>`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
