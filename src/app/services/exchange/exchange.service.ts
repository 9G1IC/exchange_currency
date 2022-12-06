import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {CURRENCIES, Currency, DataElement, IChartData, ICurrencyPair, IExchange, IRate, RawData} from 'src/app/types/currency';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

import * as moment from 'moment';

@Injectable({
		providedIn: 'root'
})
export class ExchangeService {


		public latestPageTitle:string = ""
		public latestPageTitle$:BehaviorSubject<string>

		public latestExchange:IExchange
		public latestExchange$:BehaviorSubject<IExchange>

		//Data Provider for the Chart Component
		public historyRates:IChartData
		public historyRates$:BehaviorSubject<IChartData>

		//Data provider for the rates component
		public pairs:ICurrencyPair
		public pairs$:BehaviorSubject<ICurrencyPair> 


		constructor(private http:HttpClient) { 

				this.latestExchange = {
						From:Currency.EUR,
						To:Currency.USD,
						Amount:1
				} as IExchange

				this.latestExchange$ = new BehaviorSubject(this.latestExchange)
				this.historyRates  = {
						Rates:[],
						Exchange:this.latestExchange
				} as IChartData

				this.pairs = { } as ICurrencyPair
				this.historyRates$ = new BehaviorSubject(this.historyRates)
				this.pairs$ = new BehaviorSubject(this.pairs)
				this.latestPageTitle$ = new BehaviorSubject(this.latestPageTitle)
		}

		makeHistory(dailyRates:Data,targetCurrency:IExchange){
				//Rest the chart data
				const chartData:number[] = []
				//Get the of the history
				const months = Object.keys(dailyRates).sort()

				for(let i = 0; i < months.length; i++){
						const month = months[i]
						const data = dailyRates[month]
						const value = data[targetCurrency.To]
						chartData.push(value)
				}
				this.historyRates.Rates = chartData	
				this.historyRates.Exchange = this.latestExchange
		}

		//Return a map for easy search
		makeRate(rawRates:any, exchange:IExchange):ICurrencyPair{
				//This function repackages the rawRate from an object to an array
				//
				//Get the keys
				const keys = Object.keys(rawRates)
				//New map container
				const ret:ICurrencyPair = {} as ICurrencyPair

				//Repackage all the currencies
				for(let i = 0; i < keys.length; i++){
						const sym: Currency = keys[i] as Currency
						const rate = rawRates[sym]
						//Compute total
						const total = Number(rate * exchange.Amount).toFixed(6)
						//Make stub
						const stub:IRate = {
								rate,
								base:exchange.From,
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

		getRate$(exchange:IExchange): Observable<ICurrencyPair> {
				const url = environment.url
				const today = moment() .format("YYYY-MM-DD")
				const sd = moment(today).subtract(365,"days").format("YYYY-MM-DD")
				const base = exchange.From.trim()
				const api = `${url}/timeseries?start_date=${sd}&end_date=${today}&base=${base}&symbols=${exchange.To}`

				return this.http.get(api)
				.pipe(map((response:any)=>{
						return this.responseHandler(response,exchange,today)
				}))
		}

		filterDays(rates:RawData):RawData{
				//Sort the keys to ensure the filter gets only the last day of the
				const keys = Object.keys(rates).sort()
				const months:RawData = {} as RawData
				//Use FOR loop instead of FOREACH for better performance
				//Filter for the last of the months
				for( let i = 0; i < keys.length; i++) {
						const key = keys[i]
						const month = moment(key).format("MM")
						const elt:DataElement = rates[key]
						months[month] = elt
				}
				//Make the history data
				//
				return months
		}


		responseHandler(response:any,exchange:IExchange,today:string):ICurrencyPair{

				if (!response.success){
						throw new Error(response.error.type)
				}

				//Unpack
				const rates:RawData = response.rates
				const filtered = this.filterDays(rates)
				this.makeHistory(filtered, exchange)
				//extract the latest values
				const latest = rates[today]
				const ret = this.makeRate(latest, exchange)

				//Update the rate for rates component
				return  ret
		}


		getHistory$():Observable<IChartData> {
				this.historyRates$.next(this.historyRates)
				return this.historyRates$
		}

		setPageTite(title:string):void{
				this.latestPageTitle = title	
		}

		getPageTitle$():Observable<string>{
				this.latestPageTitle$.next(this.latestPageTitle)
				return this.latestPageTitle$ 
		}

}
