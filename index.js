  var cityInput   = document.getElementById("cityInput");
  var searchBtn   = document.getElementById("searchBtn");
  var errorMsg    = document.getElementById("errorMsg");
  var loaderMsg   = document.getElementById("loaderMsg");
  var resultCard  = document.getElementById("resultCard");

  function showError(msg) {
    errorMsg.textContent  = msg;
    loaderMsg.textContent = "";
    resultCard.classList.remove("show");
  }

  function showLoader(msg) {
    loaderMsg.textContent = msg;
    errorMsg.textContent  = "";
    resultCard.classList.remove("show");
  }

  function clearMessages() {
    errorMsg.textContent  = "";
    loaderMsg.textContent = "";
  }

  function getCoordinates(city) {
    var url = "https://geocoding-api.open-meteo.com/v1/search?name="
              + encodeURIComponent(city) + "&count=1";

    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (!data.results || data.results.length === 0) {
          throw new Error("City not found. Please try another name.");
        }
        return data.results[0];
      });
  }

  function getWeatherData(lat, lon) {
    var url = "https://api.open-meteo.com/v1/forecast"
              + "?latitude="  + lat
              + "&longitude=" + lon
              + "&current=temperature_2m,wind_speed_10m,relative_humidity_2m";

    return fetch(url)
      .then(function(response) {
        return response.json();
      });
  }

  function displayResult(location, weather) {
    document.getElementById("cityName").textContent    = location.name;
    document.getElementById("countryBadge").textContent = location.country || "";
    document.getElementById("temp").textContent        = Math.round(weather.current.temperature_2m);
    document.getElementById("wind").textContent        = Math.round(weather.current.wind_speed_10m);
    document.getElementById("humidity").textContent    = Math.round(weather.current.relative_humidity_2m);
    clearMessages();
    resultCard.classList.add("show");
  }

  function searchWeather() {
    var city = cityInput.value.trim();

    if (!city) {
      showError("Please enter a city name.");
      return;
    }

    showLoader("Searching for " + city + "...");

    getCoordinates(city)
      .then(function(location) {
        loaderMsg.textContent = "Fetching weather data...";

        return getWeatherData(location.latitude, location.longitude)
          .then(function(weather) {
            return { location: location, weather: weather };
          });
      })
      .then(function(result) {
        displayResult(result.location, result.weather);
      })
      .catch(function(error) {
        showError(error.message || "Something went wrong. Check your connection.");
      });
  }

  searchBtn.addEventListener("click", function() {
    searchWeather();
  });

  cityInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      searchWeather();
    }
  });