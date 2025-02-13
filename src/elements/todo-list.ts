import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

interface Lista {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

@customElement('todo-list')
export class ToDoElement extends LitElement {

    @property({ type: Array }) porHacer: Lista[] = [];
    newItem = '';

    static get styles() {
        return css`
            :host{
                display:block;
            }

            header{
                background-color: #0dcaf0;
                position: sticky;
                top:0;
                color: white;
                margin:0;
                padding: 0;
                text-align: center;
                margin-bottom: 5px;
            }
            .To-do{
                background-color: #cff4fc;
                color:rgb(7, 58, 70);
                border: 1px solid rgb(70, 200, 230);
                border-radius: 10px;
                padding-left: 10px;
                margin-bottom: 5px;
                height:auto;
            }
            .widget{
                width: 25%;
                height: 300px;
                overflow: auto;
            }
        
            button{
                background-color: #cff4fc;
                color:rgb(7, 58, 70);
                font-weight: bold;
                border: none;
                cursor: pointer
            }

            textarea{
                width: 80%;
                height: 30px;
                background-color:rgb(42, 202, 235);
                color: #ffffff;
                border: none;
                resize: none;
                font-size: 14px;
                
            }
            textarea:focus{
                outline: none !important;

            }
            textarea::placeholder{
                color:white;
            }

            ::-webkit-scrollbar {
                 width: 5px;
            }

            ::-webkit-scrollbar-thumb {
                background:  #f1f1f1;
            }

            ::-webkit-scrollbar-thumb:hover {
                background:rgb(224, 224, 224);  
            }
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }

    async fetchData() {
        try {
            const response = await fetch('https://dummyjson.com/todos?limit=10');
            const data = await response.json();
            this.porHacer = [...this.porHacer, ...data.todos]
            console.log(this.porHacer)
        } catch (error) {
            console.log("Hubo un error: ", error);
            this.porHacer = [];
        }
    }


    render() {
        return html`
        <div class="shadow w-25 mx-auto flex flex-row justify-content-center bg-body-tertiary rounded ">
            <div class="widget"> 
                <header>
                    <h3>To do list</h3>
                    <textarea 
                        type="text" .value="${this.newItem}" 
                        @input="${this.handleInputChange}" placeholder="Agregar...">
                    </textarea>
                    <button @click="${this.nuevoItem}">+</button>
                </header>
            ${this.porHacer.map(hacer => html`
                <div class="To-do">
                    <p>${hacer.todo}</p>
                    <div class="row">
                        <button @click="${() => this.eliminar(hacer.id)}">Done</button>
                    </div>
                </div>
                `)}
            </div>
        </div>
        `
    }

    nuevoItem() {
        if (!this.newItem.trim()) return;
        const item = {
            id: this.porHacer.length + 1,
            todo: this.newItem,
            completed: false,
            userId: this.porHacer.length + 1
        }
        this.porHacer = [...this.porHacer, item];
        this.newItem = '';
    }

    handleInputChange(event: Event) {
        this.newItem = (event.target as HTMLInputElement).value;
    }

    eliminar(id: number) {
        this.porHacer = this.porHacer.filter(item => item.id !== id);
    }


}