const weatherKey = "c70f1cec0035e03b2109578b4b50964e";
const geoKey = "at_uTv1N0dSb3ERjzJULR1hlfKRxKgPe";

if (!navigator.geolocation) {
  document.body.innerHTML = "Ваш браузер не поддерживает геолокацию";
} else {
  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Получение погоды с помощью координат
  getWeatherByCoordinates(latitude, longitude);
}

// Функция получения погоды с помощью координат
function getWeatherByCoordinates(latitude, longitude) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const weather = data.weather[0].main;
      const temperature = `${(data.main.temp - 273.15).toFixed(0)}°C`;
      const city = data.name;

      const window = document.querySelector(".window");

      const temp = document.createElement("p");
      const weath = document.createElement("p");
      const spanChange = document.createElement("span");
      const windowSearch = document.querySelector(".windowSearch");

      temp.classList.add("temp");
      weath.classList.add("weather");
      spanChange.classList.add("changeCity");

      window.appendChild(temp);
      window.appendChild(weath);
      window.appendChild(spanChange);

      temp.textContent = temperature;
      weath.textContent = `${weather} in ${city}`;
      spanChange.textContent = "Change city";

      spanChange.addEventListener("click", () => {
        window.innerHTML = "";
        windowSearch.classList.add("show");
      });
    })

    .catch((error) => {
      console.log("Error fetching weather data:", error);
    });
}

function error() {
  // Получение погоды по IP
  getWeatherByIP();
}

// Функция получения погоды по IP
function getWeatherByIP() {
  const geoUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${geoKey}`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((data) => {
      const city = data.location.city;

      // Запрос погоды по городу
      getWeatherByCity(city);
    })
    .catch((error) => {
      console.log("Error fetching IP geolocation data:", error);
    });
}

// Функция получения погоды по городу

function getWeatherByCity(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const weather = data.weather[0].main;
      const temperature = `${(data.main.temp - 273.15).toFixed(0)}°C`;
      const cityName = data.name;
      const window = document.querySelector(".window");

      const temp = document.createElement("p");
      const weath = document.createElement("p");
      const spanChange = document.createElement("span");
      const windowSearch = document.querySelector(".windowSearch");

      temp.classList.add("temp");
      weath.classList.add("weather");
      spanChange.classList.add("changeCity");

      window.appendChild(temp);
      window.appendChild(weath);
      window.appendChild(spanChange);

      temp.textContent = temperature;
      weath.textContent = `${weather} in ${cityName}`;
      spanChange.textContent = "Change city";

      spanChange.addEventListener("click", () => {
        window.innerHTML = "";
        windowSearch.classList.add("show");
      });
    })
    .catch((error) => {
      console.log("Error fetching weather data by city:", error);
    });
}

// Функция поиска по нажатию на кнопку

const buttonFind = document.querySelector(".btnFind");
buttonFind.addEventListener("click", printWeather);

function printWeather() {
  const input = document.querySelector(".input");
  const city = input.value;
  input.value = "";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}`;
  const windowSearch = document.querySelector(".windowSearch");
  windowSearch.classList.add("hiddenSearch");

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const weather = data.weather[0].main;
      const temperature = `${(data.main.temp - 273.15).toFixed(0)}°C`;
      const cityName = data.name;
      const windowResult = document.querySelector(".windowResult");

      const temp = document.createElement("p");
      const weath = document.createElement("p");
      const spanChange = document.createElement("span");

      temp.classList.add("temp");
      weath.classList.add("weather");
      spanChange.classList.add("changeCity");

      windowResult.appendChild(temp);
      windowResult.appendChild(weath);
      windowResult.appendChild(spanChange);

      temp.textContent = temperature;
      weath.textContent = `${weather} in ${cityName}`;
      spanChange.textContent = "Change city";
      spanChange.addEventListener("click", () => {
        windowResult.innerHTML = "";
        windowSearch.classList.remove("hiddenSearch");
      });
    })
    // Создаем новый див, если город не найден
    .catch((error) => {
      const errorMessage = document.createElement("div");
      const errorText = document.createElement("p");
      const errorCity = document.createElement("p");
      const windowResult = document.querySelector(".windowResult");
      const changeCityButton = document.createElement("button");

      errorMessage.classList.add("error");
      errorText.classList.add("error__text");
      errorCity.classList.add("errorCity");
      changeCityButton.classList.add("btnTryAgain");

      windowResult.appendChild(errorMessage);
      errorMessage.appendChild(errorText);
      errorMessage.appendChild(errorCity);
      errorMessage.appendChild(changeCityButton);

      errorText.textContent = "Ooops. Something went wrong.";
      errorCity.textContent = "Your city is not defined";
      changeCityButton.textContent = "Try again";

      changeCityButton.addEventListener("click", () => {
        errorMessage.remove();
        windowSearch.classList.remove("hiddenSearch");
      });
    });
}
