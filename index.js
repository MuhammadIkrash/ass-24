// ICONS
function icon(code){
    if(code===0) return "☀️";
    if(code<=2) return "⛅";
    if(code<=48) return "☁️";
    if(code<=67) return "🌧️";
    return "⛈️";
}

// CITY → COORDS
async function getCoords(city){
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const data = await res.json();

    if(!data.results) return null;

    return {
        name:data.results[0].name,
        lat:data.results[0].latitude,
        lon:data.results[0].longitude
    };
}

// WEATHER
async function getWeather(lat,lon){
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    );
    return await res.json();
}

// MAIN
document.getElementById("btn").addEventListener("click", async ()=>{

    const city = document.getElementById("cityInput").value.trim();
    if(!city) return;

    const coords = await getCoords(city);
    if(!coords){
        alert("City not found!");
        return;
    }

    const weather = await getWeather(coords.lat,coords.lon);

    // CURRENT
    document.getElementById("city").innerText = coords.name;
    document.getElementById("temp").innerText = weather.current_weather.temperature+"°C";
    document.getElementById("wind").innerText = "Wind: "+weather.current_weather.windspeed+" km/h";

    document.getElementById("desc").innerText =
        "Weather Code: "+weather.current_weather.weathercode;

    // FORECAST
    const box = document.getElementById("forecast");
    box.innerHTML="";

    for(let i=0;i<5;i++){
        box.innerHTML += `
        <div class="day">
            <div>${icon(weather.daily.weathercode[i])}</div>
            <p>${weather.daily.temperature_2m_max[i]}° / ${weather.daily.temperature_2m_min[i]}°</p>
        </div>
        `;
    }
});