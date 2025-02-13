import { html,LitElement } from "lit";
import { customElement, state} from "lit/decorators.js";
import { consultApi } from "./currency";
import Chart from 'chart.js/auto'

@customElement("widget-exchange")
export class WidgetExchange extends LitElement {
  @state() currencies = [];
  @state() fromCurrency = "";
  @state() toCurrency = "";
  @state() value = 0;
  @state() intervals = []
  @state() result = ""
  service = new consultApi();
  chartInstance = null; 

  async firstUpdated() {
    await this.getCurrencies();
    
  }

  async getCurrencies(){
    const response = await this.service.getCurrencies();
    if (response.currencies) {
      console.log(response);
      this.currencies = Object.entries(response.currencies).map(([key, value]) => ({ code: key, name: value }));
    }
  }

  async intervalCurrency(){
    const response = await this.service.intervalCurrency(this.toCurrency,this.fromCurrency,"2025-02-01","2025-02-12");
    
    const unidad = this.fromCurrency;
    console.log(unidad)
    // Acceder a los valores de la moneda 
    const values = response.results[unidad];

    // Mapear las fechas y valores a un formato adecuado
    this.intervals = Object.entries(values).map(([date, value]) => ({
        date,
        value
    }));

    console.log(this.intervals); // Para verificar cómo quedó el formato
  }

  async convertCurrency() {
    if (!this.fromCurrency || !this.toCurrency || !this.value) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    const response = await this.service.convertCurrency(this.fromCurrency, this.toCurrency, this.value);
    console.log(response);
    this.result = response.result.rate + " " + this.toCurrency; 
    await this.generateChart();
  }

  async generateChart(){
     await this.intervalCurrency();
     // Verificar si el canvas está en el DOM
     const canvas = this.renderRoot?.querySelector("#canvas") as HTMLCanvasElement;
     const container = this.renderRoot?.querySelector("#canvas-container") as HTMLDivElement;

     container.classList.remove("d-none");

     if (!canvas) return;
 
     // Destruir el gráfico anterior si existe
     if (this.chartInstance) {
       this.chartInstance.destroy();
     }
 
     // Crear nuevo gráfico
     this.chartInstance = new Chart(canvas, {
       type: "line",
       data: {
         labels: this.intervals.map((row) => row.date),
         datasets: [
           {
             label: "Valor de la divisa",
             data: this.intervals.map((row) => row.value),
             borderColor: "blue",
             backgroundColor: "rgba(0, 0, 255, 0.2)",
             fill: true,
           },
         ],
       },
       options: {
         responsive: true,
         scales: {
           y: { beginAtZero: false },
         },
       },
     });
  }

  handleInputChange(e) {
    this.value = Number(e.target.value);
  }

  render() {
    return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
        rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
        crossorigin="anonymous">

        <div class="shadow w-25 mx-auto flex flex-row justify-content-center bg-body-tertiary rounded ">
            <div class="w-100  flex flex-column gap-3 p-3 mt-5" >
                <h5 class="card-title text-center">Conversor de divisas</h5>
                <div class="">
                <label for="fromCurrency" class="form-label">Moneda de origen</label>
                <select
                    id="fromCurrency"
                    @change=${(e) => (this.fromCurrency = e.target.value)}
                    class="form-select"
                >
                    <option value="" selected disabled>Seleccione</option>
                    ${this.currencies.map(
                    (currency) => html`<option value="${currency.code}">${currency.name}</option>`
                    )}
                </select>
                </div>
                <div class="">
                    <label for="toCurrency" class="form-label">Moneda de destino</label>
                    <select
                        id="toCurrency"
                        @change=${(e) => (this.toCurrency = e.target.value)}
                        class="form-select"
                    >
                        <option value="" selected disabled>Seleccione</option>
                        ${this.currencies.map(
                        (currency) => html`<option value="${currency.code}">${currency.name}</option>`
                        )}
                    </select>
                </div>
                <div class="">
                <label for="amount" class="form-label">Cantidad</label>
                <input
                    id="amount"
                    type="number"
                    min="1"
                    @input=${this.handleInputChange}
                    class="form-control"
                    placeholder="Ingrese la cantidad"
                />
                </div>
                <button
                @click=${this.convertCurrency}
                class=" btn  btn-primary mt-3 w-100"
                >
                Convertir
                </button>
                <div class="input-group mt-3 mb-3">
                  <span class="input-group-text" >Resultado</span>
                  <input type="text" class="form-control" value="${this.result}">
                </div>
            </div>

            <div id="canvas-container" class=" px-3 d-none">
                <canvas id="canvas"></canvas>
            </div>
        </div>

    
    `;
  }
}