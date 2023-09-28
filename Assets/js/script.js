document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "b29b4ebde9931d7ca1a89fb2facde3c9";
    const cityInput = document.getElementById("cityInput");
    const searchButton = document.getElementById("searchButton");
    const currentWeather = document.querySelector(".current-weather");
    const forecast = document.querySelector(".forecast");
    const searchHistory = document.querySelector(".search-history");
    let searchHistoryData = [];

    function fetchCurrentWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const cityName = data.name;
                const temperature = Math.round(data.main.temp - 273.15);
                const humidity = data.main.humidity;
                const windSpeed = data.wind.speed;
                const weatherIcon = data.weather[0].icon;

                currentWeather.innerHTML = `
                    <h2>Current Weather in ${cityName}</h2>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
                `;
            })
            .catch(error => {
                console.error("Error fetching current weather:", error);
            });
    }

    function fetchForecast(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
           
                let forecastHTML = '<h2>5-Day Forecast</h2>';
               
                for (let i = 0; i <data.list.length; i+= 8) {
                    const date = data.list[i].dt_txt.split(' ')[0];
                    const temperature = Math.round(data.list[i].main.temp - 273.15); 
                    const humidity = data.list[i].main.humidity;
                    const windSpeed = data.list[i].wind.speed;
                    const weatherIcon = data.list[i].weather[0].icon;

                    console.log (data.list[i])

                    forecastHTML += `
                        <div class="forecast-item">
                            <p>Date: ${date}</p>
                            <p>Temperature: ${temperature}°C</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Wind Speed: ${windSpeed} m/s</p>
                            <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
                        </div>
                    `;
                }

                forecast.innerHTML = forecastHTML;
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });
    }

    function updateSearchHistory(city) {
        searchHistoryData.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryData));
        displaySearchHistory();
    }

    function displaySearchHistory() {
        searchHistory.innerHTML = "";

        searchHistoryData.forEach(city => {
            const historyItem = document.createElement("button");
            historyItem.textContent = city;
            historyItem.addEventListener("click", () => {
                cityInput.value = city;
                searchButton.click();
            });
            searchHistory.appendChild(historyItem);
        });
    }

    searchButton.addEventListener("click", function () {
        const city = cityInput.value.trim();
        if (city !== "") {
            fetchCurrentWeather(city);
            fetchForecast(city);
            updateSearchHistory(city);
        }
    });

    searchHistoryData = JSON.parse(localStorage.getItem("searchHistory")) || [];
    displaySearchHistory();
});

document.addEventListener("DOMContentLoaded", function () {
    const isDaytime = () => {
        const now = new Date();
        const hours = now.getHours();
        return hours >= 6 && hours < 18;
    };

    const toggleDayNightTheme = () => {
        const container = document.querySelector(".container");
        container.classList.toggle("day", isDaytime());
        container.classList.toggle("night", !isDaytime());
    };

    toggleDayNightTheme();

    setInterval(toggleDayNightTheme, 60000);


    let searchHistoryData = JSON.parse(localStorage.getItem("searchHistory"));
    const searchHistory = document.querySelector(".search-history");

    if (searchHistoryData) {
        searchHistoryData.forEach(city => {
            const historyItem = document.createElement("button");
            historyItem.textContent = city;
            historyItem.addEventListener("click", () => {
                cityInput.value = city;
                searchButton.click();
            });
            searchHistory.appendChild(historyItem);
        });
    }
});
