import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('nasa-element')
export class NasaElement extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      font-family: Arial, sans-serif;
      padding: 1rem;
    }
    img, iframe {
      max-width: 90%;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      margin-top: 1rem;
    }
    input {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    button {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #0077cc;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #005fa3;
    }
  `;

  @state()
    imageUrl: string = '';

  @state()
    mediaType: string = '';

  @state()
    title: string = '';

  @state()
    description: string = '';

  @state()
    selectedDate: string = '';

  async firstUpdated() {
    this.selectedDate = this.getTodayDate();
    await this.fetchNasaImage();
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0]; 
  }

  async fetchNasaImage() {
    const API_KEY = 'Ns5GxBYUExZYhqTrB9xbVy94dX2ODIwKzV35xaXM'; 
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${this.selectedDate}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener datos');

      const data = await response.json();
      this.imageUrl = data.url;
      this.mediaType = data.media_type;
      this.title = data.title;
      this.description = data.explanation;
    } catch (error) {
      console.error('Error fetching data:', error);
      this.imageUrl = '';
      this.title = 'Error al cargar la imagen';
      this.description = 'No se pudo obtener la imagen para la fecha seleccionada.';
    }
  }

  handleDateChange(event: Event) {
    this.selectedDate = (event.target as HTMLInputElement).value;
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <input type="date" @change=${this.handleDateChange} value="${this.selectedDate}" max="${this.getTodayDate()}"/>
      <button @click=${this.fetchNasaImage}>Ver imagen</button>

      ${this.mediaType === 'image'
        ? html`<img src="${this.imageUrl}" alt="NASA Image of the Day" />`
        : this.mediaType === 'video'
        ? html`<iframe width="560" height="315" src="${this.imageUrl}" frameborder="0" allowfullscreen></iframe>`
        : html`<p>No hay contenido disponible.</p>`}

      <p>${this.description}</p>
    `;
  }
}
