export function renderAPOD(data) {
  const section = document.getElementById('apod-section');
  const img = section.querySelector('#apod-img');
  const description = section.querySelector('#apod-description');
  const title = section.querySelector('h2');

  if (!section || !img || !description || !title) {
    console.error("Missing elements in APOD section");
    return;
  }

  console.log("APOD Data:", data);

  title.textContent = data.title || "Astronomy Picture of the Day";

  if (data.media_type === "image") {
    img.src = data.url;
    img.alt = data.title;
    img.style.display = "block";
    img.style.maxWidth = "100%";
    img.style.margin = "1rem auto";
    img.style.border = "2px solid #00bcd4";
  } else {
    img.style.display = "none";
    const iframe = document.createElement("iframe");
    iframe.src = data.url;
    iframe.width = "100%";
    iframe.height = "400";
    iframe.style.border = "none";
    iframe.allowFullscreen = true;
    section.insertBefore(iframe, description);
  }

section.innerHTML = `
  <h2>${data.title}</h2>
  <img src="${data.url}" alt="${data.title}" style="max-width:100%;" />
  <p>${data.explanation}</p>
  <button id="save-apod-btn">Save to Favorites</button>
`;

  const btn = document.getElementById('save-apod-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      import('./data.js').then(({ saveFavorite }) => {
        saveFavorite(data);
        alert('Saved to favorites!');
      });
    });
  } else {
    console.warn("Save button not found.");
  }
}

export function renderWeather(data, location) {
  const section = document.getElementById('weather-section');
  section.innerHTML = `
    <h2>Stargazing Conditions in ${location.city}, ${location.region}</h2>
    <ul>
      <li><strong>Time:</strong> ${new Date(data.time).toLocaleString()}</li>
      <li><strong>Temperature:</strong> ${data.temperature}°C</li>
      <li><strong>Humidity:</strong> ${data.humidity}%</li>
      <li><strong>Cloud Cover:</strong> ${data.cloudCover}%</li>
      <li><strong>Wind Speed:</strong> ${data.windSpeed} m/s</li>
    </ul>
  `;
}

function calculateMoonPhase(date = new Date()) {
  const synodicMonth = 29.530588853;
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));

  const daysSinceKnown = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
  const currentPhase = daysSinceKnown % synodicMonth;

  const phaseIndex = Math.floor((currentPhase / synodicMonth) * 8);
  const phases = [
    { name: "New Moon", icon: "🌑" },
    { name: "Waxing Crescent", icon: "🌒" },
    { name: "First Quarter", icon: "🌓" },
    { name: "Waxing Gibbous", icon: "🌔" },
    { name: "Full Moon", icon: "🌕" },
    { name: "Waning Gibbous", icon: "🌖" },
    { name: "Last Quarter", icon: "🌗" },
    { name: "Waning Crescent", icon: "🌘" },
  ];

  return phases[phaseIndex];
}

const events = {
  4: { label: "Full Moon", type: "moon" },
  14: { label: "Meteor Shower", type: "meteor" },
  30: { label: "Lunar Eclipse", type: "moon" }
};

export function renderCalendar(year = 2025, month = 5) {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  const date = new Date(year, month, 1); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = date.getDay();

  let html = '';
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  html += dayNames.map(d => `<div class="calendar-header">${d}</div>`).join('');

  for (let i = 0; i < startDay; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const event = events[d];
    html += `
      <div class="calendar-day${event ? ' has-event' : ''}" data-day="${d}">
        ${d}
        ${event ? `<div class="event-label">${event.label}</div>` : ''}
      </div>`;
  }

  calendarEl.innerHTML = html; 
}

export function renderMoonPhase() {
  const { name, icon } = calculateMoonPhase();

  const iconEl = document.getElementById('moon-icon');
  const descEl = document.getElementById('moon-description');

  if (iconEl) iconEl.textContent = icon;
  if (descEl) descEl.textContent = name;
}

export function renderFavorites(favs) {
  const gallery = document.getElementById('favorites-gallery');
  if (!gallery) return;

  if (!favs.length) {
    gallery.innerHTML = `<p>No favorites saved yet.</p>`;
    return;
  }

  gallery.innerHTML = favs.map(fav => `
    <div class="gallery-item">
      <img src="${fav.url}" alt="${fav.title}" />
      <p>${fav.title}</p>
    </div>
  `).join('');
}
