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
        return html`
      <div class="container mt-5">
        <h1 class="text-center mb-4">Últimas Noticias</h1>
        <div class="row">
          ${this.articles.map(
            (article) => html`
              <div class="col-md-4 mb-4">
                <div class="card" style="width: 18rem;">
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
    .container{
    margin-left: 20px;
    }

    .card-img-top {
      height: 200px;
      object-fit: cover;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .custom-card {
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease-in-out;
    }

    .custom-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .card-body {
      padding: 15px;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: bold;
    }

    .card-text {
      font-size: 0.9rem;
      color: #555;
      margin-bottom: 15px;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }

    .col-md-4 {
        flex: 0 0 32%; 
        max-width: 32%;
      }

    @media (max-width: 420px) {
      .col-md-4 {
        flex: 0 0 100%; 
        max-width: 100%;
      }
    }
  `;
}