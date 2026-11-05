const geoUrl = "https://geocoding-api.open-meteo.com/v1/search?count=1&name=";
const weatherUrl = "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";

const searchInput = document.querySelector(".search-box input");
const searchBtn = document.getElementById("search");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {
        const geoResponse = await fetch(geoUrl + encodeURIComponent(city));
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            alert("City not found");
            return;
        }

        const place = geoData.results[0];

        const weatherResponse = await fetch(
            weatherUrl + "&latitude=" + place.latitude + "&longitude=" + place.longitude
        );
        const data = await weatherResponse.json();

        document.querySelector(".city").innerHTML = place.name;
        document.querySelector(".temp").innerHTML = Math.round(data.current.temperature_2m) + "°C";
        document.querySelector(".humidity").innerHTML = data.current.relative_humidity_2m + "%";
        document.querySelector(".wind").innerHTML = data.current.wind_speed_10m + " km/h";

        const code = data.current.weather_code;

        if (code === 0) {
            weatherIcon.src = "images/clear.png";
        }
        else if (code >= 1 && code <= 3) {
            weatherIcon.src = "images/clouds.png";
        }
        else if (code === 45 || code === 48) {
            weatherIcon.src = "images/mist.png";
        }
        else if (code >= 51 && code <= 57) {
            weatherIcon.src = "images/drizzle.png";
        }
        else {
            weatherIcon.src = "images/rain.png";
        }

    } catch (error) {
        console.log("Error:", error);
        alert("Something went wrong, please check your connection");
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchInput.value.trim());
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchInput.value.trim());
    }
});

checkWeather("Cairo");