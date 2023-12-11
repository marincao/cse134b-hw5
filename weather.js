class WeatherWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        const condition = document.createElement('div');
        condition.innerHTML = `
            <div>
                <p id="Weather"></p>
            </div>
        `;
        this.shadowRoot.appendChild(condition);
    }

    connectedCallback() {
        this.updateWeather();
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');
		const formattedTime = `${hours}:${minutes}:${seconds}`;
        /** update by hour */
		if (minutes == '00' && seconds == '00') {
			this.updateWeather();
		}
    }

    updateWeather() {
        fetch('https://api.weather.gov/gridpoints/SGX/55,21/forecast')
            .then(response => response.json())
            .then(data => {
                const weatherData = data.properties.periods[0];
                console.log(weatherData); 
                const forecast = weatherData.shortForecast;
                const temperature = weatherData.temperature;
                const unit = weatherData.temperatureUnit;
                const windspeed = weatherData.windSpeed;
                const humidity = weatherData.relativeHumidity.value;
                let icon = '';
                if(forecast.includes("Cloudy")) {
                    icon ='☁';
                } else if(forecast.includes("Sunny") || forecast.includes("Clear")) {
                    icon ='☀';
                } else if(forecast.includes("Rain")) {
                    icon ='🌧';
                }                
                this.shadowRoot.querySelector('#Weather').textContent = icon + ' Weather: ' + forecast + ' ' + temperature + '°' + unit
                    + ' Windspeed: ' + windspeed + ' Humidity: ' + humidity + '%';
            })
            .catch(error => {
                console.error(error);
            });
    }
}

customElements.define('weather-widget', WeatherWidget);