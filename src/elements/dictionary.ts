import { LitElement, html, css} from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('dictionary-element')
export class DictionaryElement extends LitElement {

    @property({ type: String }) word: string;
    @property({ type: Object }) definition: any;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div id="dictionary" class="card shadow mx-auto my-5">
                <div class="card-header text-white bg-secondary">
                    <h5>Diccionario</h6> 
                </div>
                <div class="input-group my-3 px-3">
                    <span class="input-group-text">Def.</span>
                    <input class="form-control" type="text" .value=${this.word || ""} @input="${this._updateWord}" placeholder="Ingresa una palabra" />
                    <button class="btn btn-primary" @click="${this.fetchDefinition}">Obtener definición</button>
                </div>
                <div class="card-body p-3 bg-secondary-subtle">        
                    <h5 class="card-title text-uppercase">${this.definition ? this.word : ''}</h5>
                    <p class="card-text">
                        ${this.definition ? '' : 'Sin definición'}
                        <span id="pageDef"></span>
                    </p>
                </div>
            </div>
        `;
    }

    _updateWord(event: any) {
        this.word = event.target.value;
        if(this.definition) {
            this.definition = null;
            this.querySelector('#pageDef').innerHTML = '';
        }
    }

    async fetchDefinition() {
        if (this.word) {
            try {
                await fetch(`https://es.wiktionary.org/w/api.php?action=query&prop=extracts&format=json&titles=${this.word}&origin=*`)
                .then(response => response.json())
                .then(data => {
                    const page = Object.entries(data.query.pages)[0][1] as { extract: string };
                    this.definition = page.extract;
                    this.parseHtmlExtract()
                })
            } catch (error) {
                console.error('Error fetching definition:', error);
            }
        }
    }

    setDefinition(definition: HTMLElement) {
        const pageDef = this.querySelector('#pageDef');
        if (pageDef) {
            pageDef.innerHTML = '';
            pageDef.appendChild(definition)
        } else {
            console.error('Element not found');
        }
    }

    parseHtmlExtract() {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.definition, 'text/html');
        const definitionElement = doc.getElementsByTagName('dd')[0];
        if (definitionElement) {
            this.setDefinition(definitionElement);
        }
    }
}