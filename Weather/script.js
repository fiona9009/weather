function getWeather() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    console.log('city:', city);

    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    console.log('urlGeo:', urlGeo);

    fetch(urlGeo)
        .then(response => {
            if (!response.ok) {
                throw new Error('Can not fetch data lat and long. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            // Get the longitude and latitude of the first result (assuming it's the most relevant)
            const longitude = data.results[0].longitude;
            const latitude = data.results[0].latitude;

            console.log('Longitude:', longitude);
            console.log('Latitude:', latitude);
           
            const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,rain,showers,snowfall,cloud_cover,wind_speed_10m&&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`;
            
            console.log('currentWeatherUrl:', currentWeatherUrl);

            fetch(currentWeatherUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Can not fetch data current weather. Please try again.');
                    }
                    return response.json();
                })
                .then(data => {
                    displayWeather(data);
                })
                .catch(error => {
                    console.error(currentWeatherUrl + ' Error fetching current weather data: ', error);
                    alert(currentWeatherUrl + ' Error fetching current weather data. Please try again');
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayWeather(data) {
    console.log('Data:', data);

    const cityName = document.getElementById('city').value;
    const temperature = data.current.temperature_2m;
    const rain = 'RAIN:     ' + data.current.rain + ' inch';
    const showers = 'SHOWERS:   ' + data.current.showers + ' inch';
    const snow = 'SNOW:     ' + data.current.snowfall + ' inch';
    const cloudCover = 'CLOUD COVER:    ' + data.current.cloud_cover + ' %';
    const currentWindSpeed = 'WIND SPEED 10m:   ' + data.current.wind_speed_10m + ' mph';


    const cityNameHTML = `<p>${cityName}</p>`;
    const temperatureHTML = `<p>${temperature}°F</p>`;
    const conditionHTML = `
        <p>${rain}</p>  
        <p>${showers}</p>  
        <p>${snow}</p> 
        <p>${cloudCover}</p>  
        <p>${currentWindSpeed}</p> 
    `;

    document.getElementById('city-div').innerHTML = cityNameHTML;
    document.getElementById('result').style.display = 'block';

    const tempInfo = document.getElementById('temp-info');
    const conditionInfo = document.getElementById('condition-info');
    tempInfo.innerHTML = temperatureHTML;
    conditionInfo.innerHTML = conditionHTML;
    hideConditions();
    //Clear textbox after search
    document.getElementById('city').value = '';
}

function hideConditions() {
    document.getElementById('condition-link').style.display = '';
    document.getElementById('condition-link').className = 'active';
    document.getElementById('temp-link').style.display = 'none';
    document.getElementById('temp-link').className = '';
    document.getElementById('temp-info').style.display = 'block';
    document.getElementById('condition-info').style.display = 'none';
}

function hideTemperature() {
    document.getElementById('condition-link').style.display = 'none';
    document.getElementById('condition-link').className = '';
    document.getElementById('temp-link').style.display = '';
    document.getElementById('temp-link').className = 'active';
    document.getElementById('condition-info').style.display = 'block';
    document.getElementById('temp-info').style.display = 'none';
}