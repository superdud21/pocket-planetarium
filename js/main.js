import { fetchAPOD, fetchLocation, fetchWeather } from './api.js';
import { saveFavorite, getFavorites } from './data.js';
import { renderAPOD, renderWeather, renderMoonPhase, renderFavorites } from './ui.js';
import { renderCalendar } from './ui.js';

console.log("Main.js loaded");

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM fully loaded");

  try {
    const location = await fetchLocation();
    console.log("Fetched location:", location);

    const weather = await fetchWeather(location);
    console.log("Fetched weather:", weather);

    const apod = await fetchAPOD();
    console.log("Fetched APOD:", apod);

    renderWeather(weather, location);
    renderAPOD(apod);
    renderMoonPhase();
    renderCalendar();
    renderFavorites(getFavorites());
  } catch (err) {
    console.error("Error during init:", err);
    document.body.innerHTML += `<p style="color:red;">Error: ${err.message}</p>`;
  }
});
