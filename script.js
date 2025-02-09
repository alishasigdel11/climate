// Wait for the button to be clicked
document.getElementById('get-weather-button').addEventListener('click', function() {
    const city = document.getElementById('location').value; // Get the city from the input field
    if (city) {
        getAndDisplayWeather(city); // Fetch weather when button is pressed
    } else {
        alert('Please enter a city name');
    }
});

async function getAndDisplayWeather(city) {
    let data;

    // Check if the user is online
    if (navigator.onLine) {
        try {
            console.log('Fetching data from OpenWeatherMap API...');
            // Call OpenWeatherMap API directly from the frontend
            data = await fetchWeatherFromAPI(city);
            // Cache the data in localStorage for future use
            localStorage.setItem(city, JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('forecast').innerHTML = '<p style="color: red;">Error fetching data.</p>';
            return;
        }
    } else {
        console.log('Offline mode: Fetching data from Local Storage...');
        // Fetch the weather data from localStorage when offline
        data = JSON.parse(localStorage.getItem(city));

        if (!data) {
            document.getElementById('forecast').innerHTML = '<p style="color: red;">No offline data available.</p>';
            return;
        }
    }

    // Display the weather data
    displayWeather(data);
}

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeatherFromAPI(city) {
    const apiKey = 'a7105641180d8b8bf7f6eb14ebd8ea72'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('City not found or API error.');
    }

    return response.json();
}

// Function to display weather data
function displayWeather(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${formatDate(new Date())}</p>
        <p>Main Weather Condition: ${data.weather[0].main}</p>
        <p>Weather Condition: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
        <h1>${Math.round(data.main.temp)}&deg;C</h1>
        <div class="weather-details">
            <div class="icon-container">
                <img src="https://img.icons8.com/fluency/48/humidity.png" alt="Humidity icon">
                <div>Humidity: ${data.main.humidity}%</div>
            </div>
            <div class="icon-container">
                <img src="https://img.icons8.com/fluency/48/wind.png" alt="Wind icon">
                <div>Wind: ${data.wind.speed} m/s</div>
            </div>
            <div class="icon-container">
                <img src="https://img.icons8.com/fluency/48/barometer-gauge.png" alt="Pressure icon">
                <div>Pressure: ${data.main.pressure} hPa</div>
            </div>
            <div class="icon-container">
                <img src="https://img.icons8.com/fluency/48/visible.png" alt="Visibility icon">
                <div>Visibility: ${(data.visibility / 1000).toFixed(1)} km</div>
            </div>
        </div>
    `;
}

// Helper function to format the date
function formatDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
