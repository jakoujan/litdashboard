import { environment } from './api';

export class consultApi {

    async getCurrencies(){
        try{
            const data = await fetch(environment.API_URL + 'currencies?api_key=' + environment.API_KEY)
            const result = await data.json()
            console.log(result);
            return result
        }catch(error){
            console.log(error);
        }
    }

    async convertCurrency( from: string, to: string, amount: number){
        try{
            const data = await fetch(environment.API_URL + 'convert?api_key=' + environment.API_KEY + '&from=' + from + '&to=' + to + '&amount=' + amount)
            const result = await data.json()
            return result
        }catch(error){
            console.log(error);
        }
    }

    async intervalCurrency(from: string, to: string, start: string, end: string){
        try{
            const data = await fetch(environment.API_URL + 'time-series?'  + '&from=' + from + '&to=' + to + '&start=' + start + '&end=' + end + "&api_key="+ environment.API_KEY)
            const result = await data.json();
            console.log(result)
            return result
        }catch(error){
            console.log(error);
        }
    }
} 