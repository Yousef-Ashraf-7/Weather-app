
const geoUrl = "https://geocoding-api.open-meteo.com/v1/search?count=1&name=";
const weatherUrl = "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";

const searchInput = document.querySelector(".search-box input")
const SearchBtn = document.getElementById("search");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    try {
        // الطلب الأول: نجيب إحداثيات المدينة
        const geoResponse = await fetch(geoUrl + city);
        const geoData = await geoResponse.json();

        // لو مفيش نتايج يبقى المدينة مش موجودة
        if (!geoData.results) {
            alert("city is not found");
            return;
        }

        const place = geoData.results[0];

        // الطلب التاني: نجيب الطقس بالإحداثيات
        const weatherResponse = await fetch(
            weatherUrl + "&latitude=" + place.latitude + "&longitude=" + place.longitude
        );
        const data = await weatherResponse.json();

        // عرض البيانات
        document.querySelector(".city").innerHTML = place.name;
        document.querySelector(".temp").innerHTML = Math.round(data.current.temperature_2m) + "°C";
        document.querySelector(".humidity").innerHTML = data.current.relative_humidity_2m + "%";
        document.querySelector(".wind").innerHTML = data.current.wind_speed_10m + " km/h";

        // اختيار الصورة حسب كود الطقس
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
        console.log("حصل خطأ:", error);
    }
}

SearchBtn.addEventListener("click", () => {
    checkWeather(searchInput.value.trim());
});
