import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

interface Article {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

@customElement('news-component')
export class NewsComponent extends LitElement {
    @property({ type: Array }) articles: Article[] = [];

    constructor() {
        super();
        this.fetchNews();
    }

    private async fetchNews(): Promise<void> {
        const apiKey = 'da7b3a7ae1cd4aaf90b97ddc4d30efbb';
        const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            this.articles = data.articles;
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    protected render() {
      const articlesPerWidget = this.articles.slice(0, 5);
        return html`
      <div class="card mt-3">
        <h2 class="text-center mb-3">Últimas Noticias</h2>
        <div class="row">
          ${articlesPerWidget.map(
            (article) => html`
              <div class="col-md-4 mb-3">
                <div class="card-main" style="width: 100%;">
                  <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}" />
                  <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description}</p>
                    <a href="${article.url}" target="_blank" class="btn btn-primary">Leer más</a>
                  </div>
                </div>
              </div>
            `
        )}
        </div>
      </div>
    `;
    }

    static styles = css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  .card {
    margin: 10px;
    width: 300px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-bottom: 50px;
  }

  .text-center {
    text-align: center;
  }

  .card-img-top {
    height: 120px;
    object-fit: cover;
    padding-left: 20px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .card-body {
    padding: 10px;
  }

  .card-title {
    font-size: 1rem;
    font-weight: bold;
  }

  .card-text {
    font-size: 0.8rem;
    color: #555;
    margin-bottom: 10px;
  }

  .row {
    display: flex;
    flex-direction: column;
  }

  .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  @media (max-width: 412px) {
    .card {
      width: 100%;
    }
  }
`;

}