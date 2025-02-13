import { html, LitElement } from "lit";
import { customElement} from 'lit/decorators.js'

@customElement('header-element')
export class HeaderElement extends LitElement {
    createRenderRoot() {
        return this;
    }
    render() {
        return html`
        <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
            <side-bar></side-bar>
            <span class="navbar-brand mb-0 h1">MyApp</span>
        </div>
        </nav>
        `
    }
}

