import { html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js'

@customElement('hello-world')
export class WelloWorldElement extends LitElement {
    @property()
    name: string = 'Edgar';

    render() {
        return html`
        <p>Hola ${this.name} desde un Lit Element</p>
        `
    }
}

