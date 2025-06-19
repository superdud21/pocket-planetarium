// js/api.js
const API_KEY = 'yTWs2P6MjbERrJgI8hEi6htY7m90bGJ5FZofasgu';

export async function fetchAPOD() {
  console.log("Calling NASA APOD API");
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch APOD");
  return await res.json();
}

export async function fetchLocation() {
  const res = await fetch('http://ip-api.com/json/');
  if (!res.ok) throw new Error("Failed to fetch location");
  const data = await res.json();

  return {
    city: data.city,
    region: data.regionName,
    lat: data.lat,
    lon: data.lon
  };
}

export async function fetchWeather(location) {
  const { lat, lon } = location;
  const targetURL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
  const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(targetURL)}`;

  const res = await fetch(proxyURL);
  if (!res.ok) throw new Error(`Proxy failed with status ${res.status}`);

  const wrapped = await res.json();
  const data = JSON.parse(wrapped.contents);

  const now = data.properties.timeseries[0];
  const details = now.data.instant.details;

  return {
    temperature: details.air_temperature,
    humidity: details.relative_humidity,
    cloudCover: details.cloud_area_fraction,
    windSpeed: details.wind_speed,
    time: now.time
  };
}

