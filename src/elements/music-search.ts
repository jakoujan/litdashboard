import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('music-search')
export class MusicSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Arial', sans-serif;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    }

    h3 {
      font-size: 24px;
      color: #333;
      text-align: center;
    }

    input[type='text'] {
      width: 90%;
      padding: 15px;
      font-size: 16px;
      border: 2px solid #ccc;
      border-radius: 4px;
      transition: border-color 0.3s ease;
    }

    input[type='text']:focus {
      border-color: #007bff;
      outline: none;
    }

    .text-center {
      text-align: center;
    }

    .text-primary {
      color: #007bff;
      font-weight: bold;
    }

    .text-danger {
      color: #dc3545;
      font-weight: bold;
    }

    .card {
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .card-img-top {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      object-fit: cover;
      height: 100px;
      width: 100%;
      background-color: red;
    }

    .card-body {
      padding: 15px;
      background-color: #fff;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    .card-title {/*
      font-size: 18px;*/
      font-weight: 600;
      color: #333;
    }

    .card-text {
      font-size: 14px;
      color: #555;/*
      margin-top: 5px;*/
    }

    .selected-info {
      display: flex;
      align-items: center;
    }

    .selected-track-name {
      margin-right: 20px;
    }

    .row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    audio {
      width: 100%;
      border-radius: 8px;
    }
/*
    .mb-3 {
      margin-bottom: 1rem;
    }

    .mt-3 {
      margin-top: 1rem;
    }*/

    .mt-4 {
      margin-top: 2rem;
    }
/*
    .my-4 {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }*/

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #007bff;
      font-weight: bold;
    }

  `;

  @state()
  private searchTerm: string = '';

  @state()
  private musicResults: any[] = [];

  @state()
  private loading: boolean = false;

  @state()
  private errorMessage: string = '';

  @state()
  private selectedTrackUrl: string | null = null;
  @state()
  private selectedTrackName: string | null = null;
  @state()
  private selectedArtistName: string | null = null;


  private apiKey: string = 'b1bf45ab';

  async searchMusic() {
    if (!this.searchTerm.trim()) return;

    this.loading = true;
    this.errorMessage = '';
    this.musicResults = [];

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${this.apiKey}&name=${this.searchTerm}&limit=4`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtner datos de la API Jamendo');
      }

      const data = await response.json();
      this.musicResults = data.results;
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }

  selectTrack(trackUrl: string, trackName: string, artistName: string) {
    this.selectedTrackUrl = trackUrl;
    this.selectedTrackName = trackName;
    this.selectedArtistName = artistName;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('selectedTrackUrl')) {
      const audioElement = this.shadowRoot?.querySelector('audio');
      if (audioElement) {
        audioElement.load();
      }
    }
  }

  render() {
    return html`
      <div class="container">
        <h3 class="text-center my-4">Buscador de Canciones</h3>
        <input
          type="text"
          class="form-control mb-3 p-3"
          .value="${this.searchTerm}"
          @input="${(e: Event) => {
            this.searchTerm = (e.target as HTMLInputElement).value;
            this.searchMusic();
          }}"
          placeholder="Busca una canción"
        />

        ${this.loading
          ? html`<div class="text-center text-primary">Cargando...</div>`
          : this.errorMessage
          ? html`<div class="text-danger text-center">${this.errorMessage}</div>`
          : ''
        }

        ${this.selectedTrackUrl
          ? html`
              <div class="selected-info">
                <h5 class="selected-track-name">${this.selectedTrackName}</h5>
                <p class="selected-artist-name">${this.selectedArtistName}</p>
              </div>
              <audio class="w-100 mt-3" controls autoplay>
                <source src="${this.selectedTrackUrl}" type="audio/mp3" />
                Tu navegador no soporta el formato de audio.
              </audio>
            `
          : ''
        }

        ${this.musicResults.length
          ? html`
              <div class="row mt-4">
                ${this.musicResults.map(
                  (track: any) => html`
                    <div
                      class="col-md-4 mb-4"
                      @click="${() => this.selectTrack(track.audio, track.name, track.artist_name)}"
                    >
                      <div class="card">
                        <img
                          src="${track.album_image}"
                          class="card-img-top"
                          alt="${track.album_name}"
                        />
                        <div class="card-body">
                          <h5 class="card-title">${track.name}</h5>
                          <p class="card-text">${track.artist_name}</p>
                        </div>
                      </div>
                    </div>
                  `
                )}
              </div>
            `
          : ''
        }
      </div>
    `;
  }

  
}
