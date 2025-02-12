import { LitElement, html, css } from 'lit';

class WeatherComponent extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
      transition: background 0.5s ease;
    }
    .weather-card {
      background: rgba(255, 255, 255, 0.8);
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .weather-info {
      margin-top: 1rem;
    }
  `;

  static properties = {
    city: { type: String },
    weather: { type: Object },
    error: { type: String },
  };

  constructor() {
    super();
    this.city = 'México';
    this.weather = null;
    this.error = '';
  }

  async fetchWeather() {
    const apiKey = '8a5bbe56f7882ee6d29c4234653e3124';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key no válida o no proporcionada');
        } else if (response.status === 404) {
          throw new Error('Ciudad no encontrada');
        } else {
          throw new Error('Error al obtener los datos del clima');
        }
      }
      this.weather = await response.json();
      this.error = '';
      this.updateBackground();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      this.weather = null;
      this.error = error.message;
    }
  }

  updateBackground() {
    if (this.weather) {
      const temp = this.weather.main.temp;
      let color1, color2;

      if (temp < 10) {
        color1 = '#87CEEB';
        color2 = '#FFFFFF'; 
      } else if (temp >= 10 && temp < 20) {
        color1 = '#ADD8E6'; 
        color2 = '#F0E68C'; 
      } else if (temp >= 20 && temp < 30) {
        color1 = '#FFA07A'; 
        color2 = '#FFD700';
      } else {
        color1 = '#FF4500'; 
        color2 = '#FFD700'; 
      }

      this.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    }
  }

  handleInput(event) {
    this.city = event.target.value;
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.city.trim() === '') {
      this.error = 'Por favor, ingresa una ciudad';
      return;
    }
    await this.fetchWeather();
  }

  render() {
    return html`
      <div class="weather-card">
        <form @submit=${this.handleSubmit} class="mb-3">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Ingresa una ciudad"
              .value=${this.city}
              @input=${this.handleInput}
            />
            <button type="submit" class="btn btn-primary">Obtener Clima</button>
          </div>
        </form>

        ${this.error
          ? html`<div class="alert alert-danger">${this.error}</div>`
          : this.weather
          ? html`
              <div class="weather-info">
                <h2>Clima en ${this.weather.name}</h2>
                <p>Temperatura: ${this.weather.main.temp}°C</p>
                <p>Condición: ${this.weather.weather[0].description}</p>
                <p>Humedad: ${this.weather.main.humidity}%</p>
                <p>Viento: ${this.weather.wind.speed} m/s</p>
              </div>
            `
          : html`<p>Ingresa una ciudad para ver el clima.</p>`}
      </div>
    `;
  }
}

customElements.define('weather-component', WeatherComponent);