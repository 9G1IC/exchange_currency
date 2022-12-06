import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Currency, IExchange, IRate} from 'src/app/types/currency';
import { HttpClient } from '@angular/common/http';


@Injectable({
		providedIn: 'root'
})
export class ExchangeService {
		rate: IRate[] = []

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
		}
		//When navigating from the header to the detail component, we need to pass the 
		//latest amount to compute the amount
		//
		getLatest$():BehaviorSubject<IExchange>{
				this.latestExchange$.next(this.latestExchange)
				return this.latestExchange$
		}

		getRate$(exchange:IExchange): Observable<Record<Currency,IRate>> {

		}
}

