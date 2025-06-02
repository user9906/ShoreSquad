// ShoreSquad App JS

document.addEventListener('DOMContentLoaded', () => {
  // Placeholder: Map loading
  document.getElementById('map-container').textContent = 'Map will appear here soon!';

  // Placeholder: Weather loading
  document.getElementById('weather-info').textContent = 'Weather info will appear here soon!';

  // Event creation
  const form = document.getElementById('create-event-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value;
    if (name && date) {
      addEvent({ name, date });
      form.reset();
    }
  });

  // Join event button
  document.getElementById('join-event').addEventListener('click', () => {
    alert('Feature coming soon: Join a cleanup event!');
  });

  // Initial events
  const events = [
    { name: 'Beach Cleanup - Main Shore', date: '2025-06-10' },
    { name: 'Sunset Crew Gathering', date: '2025-06-15' }
  ];
  const eventList = document.getElementById('event-list');
  function addEvent(ev) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${ev.name} - ${ev.date}</span> <button class="join-btn" aria-label="Join ${ev.name}">Join</button>`;
    li.querySelector('.join-btn').addEventListener('click', () => {
      alert(`You joined: ${ev.name}!`);
    });
    eventList.appendChild(li);
  }
  events.forEach(addEvent);

  // Performance: Lazy load map and weather when visible
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight && rect.bottom > 0
    );
  }

  // Interactive Map (Leaflet)
  function loadMap() {
    if (window.mapLoaded) return;
    window.mapLoaded = true;
    const map = L.map('map-container').setView([34.0195, -118.4912], 10); // Santa Monica, CA
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    // Example marker
    L.marker([34.0195, -118.4912]).addTo(map)
      .bindPopup('Main Shore Cleanup').openPopup();
  }

  // Weather API (NEA 4-day Forecast)
  function loadWeather() {
    if (window.weatherLoaded) return;
    window.weatherLoaded = true;
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.textContent = 'Loading 4-day forecast...';
    fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast')
      .then(res => res.json())
      .then(data => {
        const forecasts = data.items[0].forecasts;
        let html = '<div class="forecast-grid">';
        forecasts.forEach(day => {
          html += `
            <div class="forecast-day">
              <div class="forecast-date">${day.date}</div>
              <div class="forecast-forecast">${day.forecast}</div>
              <div class="forecast-temp">${day.temperature.low}&ndash;${day.temperature.high}°C</div>
              <div class="forecast-wind">Wind: ${day.wind.speed.low}&ndash;${day.wind.speed.high} km/h (${day.wind.direction})</div>
            </div>
          `;
        });
        html += '</div>';
        weatherInfo.innerHTML = html;
      })
      .catch(() => {
        weatherInfo.textContent = 'Weather unavailable.';
      });
  }

  // Lazy load map/weather on scroll
  window.addEventListener('scroll', () => {
    if (isInViewport(document.getElementById('map-container'))) loadMap();
    if (isInViewport(document.getElementById('weather-info'))) loadWeather();
  });

  // Accessibility: keyboard nav for nav links
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') a.click();
    });
  });

  // Lazy load on first view
  if (isInViewport(document.getElementById('map-container'))) loadMap();
  if (isInViewport(document.getElementById('weather-info'))) loadWeather();
});
