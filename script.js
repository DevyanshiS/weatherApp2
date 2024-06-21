"use strict";

const infoContainer = document.querySelector(".container-front");
const resContainer = document.querySelector(".container-back");
const search = document.querySelector(".search-city");
const inpCity = document.querySelector("#input-city");
const goBack = document.querySelector("#change-city");
const weatherIcon = document.querySelector(".weather-icon");

const apiKey = "a7007475a7f04444440410718929407b";

function formatCoordinates(value, type) {
    const degree = Math.abs(value);
    const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
    return `${degree.toFixed(2)}° ${direction}`;
}

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                infoContainer.classList.add("flipped");
                resContainer.classList.add("flipped");
                document.querySelector(".display-city").innerHTML = data.name;
                document.querySelector(".temp").innerHTML = Math.ceil(data.main.temp);
                document.querySelector(".feels-like").innerHTML = Math.round(data.main.feels_like);
                document.querySelector(".humidity").innerHTML = `${Math.round(data.main.humidity)} %`;
                document.querySelector(".wind-speed").innerHTML = `${Math.round(data.wind.speed)} km/h`;
                document.querySelector(".latitude").innerHTML = formatCoordinates(data.coord.lat, 'lat');
                document.querySelector(".longitude").innerHTML = formatCoordinates(data.coord.lon, 'lon');
                
                if (data.weather[0].main === "Clouds") {
                    weatherIcon.src = "weatherAppicons/clouds.png";
                    document.querySelector(".container-back").style.background = "linear-gradient(135deg, #ffffff, #a4a5a5)";
                } else if (data.weather[0].main === "Clear") {
                    weatherIcon.src = "weatherAppicons/clear.png";
                    document.querySelector(".container-back").style.background = "linear-gradient(135deg, #ffffff, #98e1fc)";
                } else if (data.weather[0].main === "Rain") {
                    weatherIcon.src = "weatherAppicons/rain.png";
                    document.querySelector(".container-back").style.background = "linear-gradient(135deg, #888686, #80b3e6)";
                } else if (data.weather[0].main === "Mist" || "Haze" ) {
                    weatherIcon.src = "weatherAppicons/mist.png";
                    document.querySelector(".container-back").style.background = "linear-gradient(135deg, #d5d5d6, #b0f5f5)";
                } else if (data.weather[0].main === "Drizzle") {
                    weatherIcon.src = "weatherAppicons/drizzle.png";
                    document.querySelector(".container-back").style.background = "linear-gradient(135deg, #f3f1f1, #f1f5f5)";
                } else if (data.weather[0].main === "Snow") {
                    weatherIcon.src = "weatherAppicons/snow.png";
                    document.querySelector(".container-back").style.background = "linear-gradient(135deg, #f3f1f1, #f1f5f5)";
                }
            } else {
                alert("City not found");
                inpCity.value = "";
            }
        })
        .catch(error => console.error("Error fetching the weather data:", error));
}

function fetchWeatherByCoords(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                fetchWeather(data.name);
            } else {
                alert("Could not retrieve weather data for your location.");
            }
        })
        .catch(error => console.error("Error fetching the weather data:", error));
}

search.addEventListener("click", function(e) {
    const city = inpCity.value.trim();

    if (city === "") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            }, () => {
                alert("Geolocation is not supported by this browser or access is denied.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    } else {
        fetchWeather(city);
    }
});

goBack.addEventListener("click", function() {
    infoContainer.classList.remove("flipped");
    resContainer.classList.remove("flipped");
    inpCity.value = "";
    document.querySelector(".container-back").style.background = ""; // Reset the background color when changing city
});

