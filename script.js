// Replace with your OpenWeatherMap API key
const API_KEY = https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

function handleEnter(event) {
  if (event.key === "Enter") {
    getWeather();
  }
}

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.trim();
  
  if (!city) {
    showError("Please enter a city name");
    return;
  }

  const loading = document.getElementById("loading");
  const weatherIcon = document.getElementById("weatherIcon");
  const weatherResult = document.getElementById("weatherResult");

  // Show loading
  loading.style.display = "block";
  weatherIcon.innerHTML = "";
  weatherResult.innerHTML = "";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check spelling.");
      } else if (response.status === 401) {
        throw new Error("Invalid API key. Please check your configuration.");
      } else {
        throw new Error("Unable to fetch weather data.");
      }
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
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const condition = data.weather[0].main;
  const description = data.weather[0].description;
  const windSpeed = data.wind.speed;
  const pressure = data.main.pressure;

  // Set weather icon based on condition
  const icon = getWeatherIcon(condition, data.weather[0].icon);
  
  document.getElementById("weatherIcon").innerHTML = icon;
  document.getElementById("weatherResult").innerHTML = `
    <b>📍 ${data.name}, ${data.sys.country}</b><br><br>
    🌡 Temperature: ${temp}°C (Feels like ${feelsLike}°C)<br>
    ☁ Condition: ${capitalizeWords(description)}<br>
    💧 Humidity: ${humidity}%<br>
    🌬 Wind Speed: ${windSpeed} m/s<br>
    🔽 Pressure: ${pressure} hPa
  `;
}

function getWeatherIcon(condition, iconCode) {
  const conditionLower = condition.toLowerCase();
  
  // Night time check
  if (iconCode && iconCode.includes('n')) {
    return "🌙";
  }
  
  if (conditionLower.includes("thunder")) return "⛈️";
  if (conditionLower.includes("drizzle")) return "🌦️";
  if (conditionLower.includes("rain")) return "🌧️";
  if (conditionLower.includes("snow")) return "❄️";
  if (conditionLower.includes("mist") || conditionLower.includes("fog") || conditionLower.includes("haze")) return "🌫️";
  if (conditionLower.includes("cloud")) return "☁️";
  if (conditionLower.includes("clear")) return "☀️";
  
  return "🌈";
}

function showError(message) {
  document.getElementById("weatherIcon").innerHTML = "⚠️";
  document.getElementById("weatherResult").innerHTML = `<span class="error">❌ ${message}</span>`;
}

function capitalizeWords(str) {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
