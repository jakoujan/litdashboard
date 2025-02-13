import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

type MenuItem = {
    title: string;
    link: string;
}

@customElement('side-bar')
export class SideBarElement extends LitElement {

    createRenderRoot() {
        return this;
    }

    @property({ type: Array<MenuItem>(), reflect: true })
    menu: MenuItem[] = []

    getMenuItemsFronJson() {
        fetch('/assets/json/menu.json')
            .then(response => response.json())
            .then(data => this.menu = data.modules)
            .catch(error => console.error(error))
            .finally(() => console.log('fetch completed', this.menu));
    }

    connectedCallback() {
        super.connectedCallback();
        this.getMenuItemsFronJson();
    }

    openOffcanvas() {
        const offcanvasElement = this.querySelector('#offcanvas');
        if (offcanvasElement) {
            offcanvasElement.classList.add('show');
            offcanvasElement.setAttribute('aria-hidden', 'false');
        }
    }

    closeOffcanvas() {
        const offcanvasElement = this.querySelector('#offcanvas');
        if (offcanvasElement) {
            offcanvasElement.classList.remove('show');
            offcanvasElement.setAttribute('aria-hidden', 'true');
        }
    }

    protected render(): unknown {
        return html`
        <button class="btn btn-outline-primary btn-menu position-absolute text-decoration-none" type="button" @click="${this.openOffcanvas}">
            <svg class="bi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
        </button>
        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel" aria-hidden="true">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">Dashboard</h5>
                <button type="button" class="btn-close text-reset" @click="${this.closeOffcanvas}" aria-label="Close">
                </button>
            </div>
            <hr>
            <div class="offcanvas-body">
                <ul class="nav nav-pills flex-column mb-auto">
                    ${this.menu.length > 0 ? this.menu.map(item => html`
                        <li class="nav-item">
                            <a class="nav-link link-dark border-bottom fw-medium" href="${item.link}">
                                <svg class="bi me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                                </svg>
                                ${item.title} 
                            </a>
                        </li>
                    `) : html`<li>Loading...</li>`}
                </ul>
            </div>
        </div>
        `;
    }
}
