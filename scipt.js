// script.js
let key = "7cb3ae871bf547ea957133910232011";
let searchForm = document.getElementById("search-form");
let searchInput = document.getElementById("search-input");
let autocompleteList = document.getElementById("autocomplete-list");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let cityName = searchInput.value;
  console.log(cityName);
  getWeatherData(cityName);
});

// Добавляем слушатель ввода для автозаполнения
searchInput.addEventListener("input", async function () {
  const inputText = searchInput.value;
  const suggestions = await getAutocompleteSuggestions(inputText);
  updateAutocompleteList(suggestions);
});

// Функция для получения предложений для автозаполнения
async function getAutocompleteSuggestions(input) {
  const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${key}&q=${input}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.map((item) => item.name);
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return [];
  }
}

// Функция для обновления списка автозаполнения
function updateAutocompleteList(suggestions) {
  autocompleteList.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const listItem = document.createElement("li");
    listItem.textContent = suggestion;
    listItem.classList.add("list-group-item");
    // Добавляем слушатель клика на элемент списка
    listItem.addEventListener("click", function () {
      // При выборе города из списка устанавливаем значение в инпут
      searchInput.value = suggestion;
      // Скрываем список автозаполнения
      autocompleteList.innerHTML = "";
      // Выполняем поиск погоды
      getWeatherData(suggestion);
    });
    autocompleteList.appendChild(listItem);
  });
}

// Функция для получения и отображения данных о погоде
function getWeatherData(cityName) {
  let countryElement = document.querySelector(".country");
  let cityElement = document.querySelector(".city");
  let tempElement = document.querySelector(".temp");
  let conditionElement = document.querySelector(".condition");

  let url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${cityName}&aqi=no`;
  fetch(url)
    .then((response) => response.json())
    .then((weatherData) => {
      countryElement.textContent = `${weatherData.location.name}, ${weatherData.location.country}`;
      tempElement.textContent = `${weatherData.current.temp_c}°C`;
      conditionElement.textContent = weatherData.current.condition.text;
      console.log(weatherData);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
