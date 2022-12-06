import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {CURRENCIES, Currency, IExchange, IRate} from 'src/app/types/currency';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

import * as moment from 'moment';

@Injectable({
		providedIn: 'root'
})
export class ExchangeService {

		latestExchange:IExchange
		latestExchange$:BehaviorSubject<IExchange>


		constructor(private http:HttpClient) { 

				this.latestExchange = {
						From:Currency.EUR,
						To:Currency.USD,
						Amount:1
				}

				this.latestExchange$ = new BehaviorSubject(this.latestExchange)
		}

		//Return a map for easy search
		makeRate(rawRates:any, base:Currency, exchange:IExchange):Record<Currency,IRate>{
				//This function repackages the rawRate from an object to an array
				//
				//Get the keys
				const keys = Object.keys(rawRates)
				//New map container
				const ret:Record<string,IRate> = {}

				//Repackage all the currencies
				for(let i = 0; i < keys.length; i++){
						const sym: Currency = keys[i] as Currency
						const rate = rawRates[sym]
						//Compute total
						const total = Number(rate * exchange.Amount).toFixed(6)
						//Make stub
						const stub:IRate = {
								rate,
								base,
								currency:sym,
								amount:Number(total)
						}

						//Add to new container
						ret[sym] = stub
				}

				return ret
		}
		//When navigating from the header to the detail component, we need to pass the 
		//latest amount to compute the amount
		//
		getLatest$():BehaviorSubject<IExchange>{
				this.latestExchange$.next(this.latestExchange)
				return this.latestExchange$
		}

		getRate$(exchange:IExchange): Observable<Record<Currency,IRate>> {
				const url = environment.url
				const api = `${url}/latest?base=${exchange.From}&symbols=${CURRENCIES}`

				this.latestExchange = exchange //Remember latest exchange for future navigations

				return this.http.get(api)
				.pipe(map((response:any)=>{
						if(!response.success){
								throw new Error(response.error.type)
						}

						//Unpack
						const rates = response.rates
						const base = response.base as Currency
						//Remap the input with today's record
						const map = this.makeRate(rates,base,exchange)
						return map
				}))
		}

		getHistory$(exchange:IExchange):Observable<Record<string,any>> {
				const url = environment.url
				const ed = moment() .format("YYYY-MM-DD")
				const sd = moment(ed).subtract(365,"days").format("YYYY-MM-DD")
				const base = exchange.From.trim()
				const api = `${url}/timeseries?start_date=${sd}&end_date=${ed}&base=${base}&symbols=${exchange.To}`

				return this.http.get(api)
				.pipe(map((response:any)=>{
						if (!response.success){
								throw new Error(response.error.type)
						}

						//Unpack
						const rates = response.rates
						//Sort the keys to ensure the filter gets only the last day of the
						//month
						const keys = Object.keys(rates).sort()
						const months: Record<string,string> = {}

						//Use FOR loop instead of FOREACH for better performance
						//Filter for the last of the months
						for( let i = 0; i < keys.length; i++) {
								const key = keys[i]
								const month = moment(key).format("MM")
								months[month] = rates[key]
						}
						return months
				}))
		}
}
