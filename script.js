/* ================================
   Hyder Weather App – 2026 (STABLE)
   ================================ */

const API_KEY = "ec1776be68043c19eda8cc08f631003d";

/* Enter key support */
function handleEnter(event) {
  if (event.key === "Enter") {
    getWeather();
  }
}

/* Fetch weather */
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

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&units=metric&appid=" +
    API_KEY;

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

/* Display weather */
function displayWeather(data) {
  const cityText = data.name + ", " + data.sys.country;
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const desc = capitalize(data.weather[0].description);
applyWeatherBackground(data.weather[0].main);

  weatherIcon.innerHTML = getWeatherIcon(
    data.weather[0].main,
    data.weather[0].icon
  );

  weatherResult.innerHTML =
    "<strong>📍 " + cityText + "</strong><br><br>" +
    "🌡 Temperature: " + temp + "°C (Feels like " + feels + "°C)<br>" +
    "☁ Weather: " + desc + "<br>" +
    "💧 Humidity: " + data.main.humidity + "%<br>" +
    "🌬 Wind: " + data.wind.speed + " m/s<br>" +
    "🔽 Pressure: " + data.main.pressure + " hPa";

  const side = document.getElementById("sideWeather");
  if (side) {
    side.innerHTML =
      "📍 " + cityText + "<br>" +
      "🌡 " + temp + "°C<br>" +
      "☁ " + desc + "<br>" +
      "💧 " + data.main.humidity + "%<br>" +
      "🌬 " + data.wind.speed + " m/s";
  }
}

/* Icons */
function getWeatherIcon(condition, iconCode) {
  const c = condition.toLowerCase();
  if (iconCode.indexOf("n") !== -1) return "🌙";
  if (c.indexOf("thunder") !== -1) return "⛈️";
  if (c.indexOf("rain") !== -1) return "🌧️";
  if (c.indexOf("drizzle") !== -1) return "🌦️";
  if (c.indexOf("snow") !== -1) return "❄️";
  if (c.indexOf("cloud") !== -1) return "☁️";
  if (c.indexOf("mist") !== -1 || c.indexOf("fog") !== -1 || c.indexOf("haze") !== -1) return "🌫️";
  if (c.indexOf("clear") !== -1) return "☀️";
  return "🌈";
}

/* Error */
function showError(message) {
  weatherIcon.innerHTML = "⚠️";
  weatherResult.innerHTML = "<span class='error'>❌ " + message + "</span>";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
// 📍 Auto detect user location
function getLocationWeather() {
  if (!navigator.geolocation) {
    showError("Geolocation not supported");
    return;
  }
function getLocationWeather() {
  if (!navigator.geolocation) {
    loadDefaultCity();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const loading = document.getElementById("loading");
      loading.style.display = "block";

      const url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=metric&appid=" +
        API_KEY;

      try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
      } catch (err) {
        loadDefaultCity();
      } finally {
        loading.style.display = "none";
      }
    },
    () => {
      // ❌ Permission denied → fallback
      loadDefaultCity();
    }
  );
}
function loadDefaultCity() {
  document.getElementById("weatherIcon").innerHTML = "📍";
  document.getElementById("weatherResult").innerHTML =
    "<b>Location access denied</b><br>Please search city manually 👆";

  // Optional: auto-load Delhi weather
  document.getElementById("cityInput").value = "Delhi";
  getWeather();
}
function updateHistory(city) {
  if (searchHistory.includes(city)) return;

  searchHistory.unshift(city);
  if (searchHistory.length > 5) searchHistory.pop();

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  searchHistory.forEach(c => {
    const li = document.createElement("li");
    li.innerText = c;
    li.onclick = () => {
      document.getElementById("cityInput").value = c;
      getWeather();
    };
    list.appendChild(li);
  });
}
function applyWeatherBackground(condition) {
  document.body.classList.remove("clear", "rain", "cloud");

  const c = condition.toLowerCase();
  if (c.includes("rain")) document.body.classList.add("rain");
  else if (c.includes("cloud")) document.body.classList.add("cloud");
  else document.body.classList.add("clear");
}
