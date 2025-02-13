import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('music-search')
export class MusicSearch extends LitElement {
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

  private apiKey: string = 'b1bf45ab';

  async searchMusic() {
    if (!this.searchTerm.trim()) return;

    this.loading = true;
    this.errorMessage = '';
    this.musicResults = [];

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${this.apiKey}&name=${this.searchTerm}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching data from Jamendo API');
      }

      const data = await response.json();
      this.musicResults = data.results;
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }

  selectTrack(trackUrl: string) {
    this.selectedTrackUrl = trackUrl;
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
          class="form-control mb-3"
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
                      @click="${() => this.selectTrack(track.audio)}"
                    >
                      <div class="card h-100">
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
