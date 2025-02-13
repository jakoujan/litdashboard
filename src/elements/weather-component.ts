import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('weather-component')
export class WeatherComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      transition: background 0.5s ease;
    }
  `;

  @property({ type: String })
  city: string = '';

  @property({ type: Object })
  weather: any = null;

  @property({ type: String })
  error: string = '';

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
      this.error = (error as Error).message;
    }
  }

  updateBackground() {
    if (this.weather) {
      const temp = this.weather.main.temp;
      let color1: string, color2: string;

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

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.city = input.value;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    if (this.city.trim() === '') {
      this.error = 'Por favor, ingresa una ciudad';
      return;
    }
    await this.fetchWeather();
  }

  render() {
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <div id="clima" class="d-flex justify-content-center align-items-center vh-100">
        <div class="weather-card bg-light p-4 rounded shadow text-center">
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
                  <p class="mb-1">Temperatura: ${this.weather.main.temp}°C</p>
                  <p class="mb-1">Condición: ${this.weather.weather[0].description}</p>
                  <p class="mb-1">Humedad: ${this.weather.main.humidity}%</p>
                  <p class="mb-0">Viento: ${this.weather.wind.speed} m/s</p>
                </div>
              `
            : html`<p class="mb-0">Ingresa una ciudad para ver el clima.</p>`}
        </div>
      </div>
    `;
  }
}