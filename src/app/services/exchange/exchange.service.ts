import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import {CURRENCIES, Currency, DataElement, IChartData, ICurrencyPair, IExchange, IRate, RawData} from 'src/app/types/currency';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

import * as moment from 'moment';

@Injectable({
		providedIn: 'root'
})
export class ExchangeService {

		public latestPageTitle:string = "Currency Exchanger"
		public latestPageTitle$:BehaviorSubject<string>

		public latestExchange:IExchange
		public latestExchange$:BehaviorSubject<IExchange>

		//Data Provider for the Chart Component
		public historicalRates:IChartData
		public historicalRates$:BehaviorSubject<IChartData>

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
				this.historicalRates  = {
						Rates:[],
						Exchange:this.latestExchange
				} as IChartData

				this.pairs = { } as ICurrencyPair
				this.historicalRates$ = new BehaviorSubject(this.historicalRates)
				this.pairs$ = new BehaviorSubject(this.pairs)
				this.latestPageTitle$ = new BehaviorSubject(this.latestPageTitle)
		}

		makeHistory(dailyRates:RawData,exchange:IExchange){
				//Rest the chart data
				const chartData:number[] = []
				//Get the of the history
				const days = Object.keys(dailyRates).sort()

				for(let i = 0; i < days.length; i++){
						const day = days[i]
						const data:DataElement = dailyRates[day]
						const value = data[exchange.To]
						chartData.push(value)
				}
				this.historicalRates.Rates = chartData	
				this.historicalRates.Exchange = exchange
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

		getRate$(exchange:IExchange): Observable<IRate> {
				const url = environment.url
				const today = moment() .format("YYYY-MM-DD")
				const sd = moment(today).subtract(365,"days").format("YYYY-MM-DD")
				const base = exchange.From.trim()
				const api = `${url}/timeseries?start_date=${sd}&end_date=${today}&base=${base}&symbols=${CURRENCIES}`

				const data = localStorage.getItem("temp") 
				if(!data){
						return this.http.get(api)
						.pipe(map((response:any)=>{
								localStorage.setItem("temp", JSON.stringify(response))
								return this.responseHandler(response,exchange,today)
						}))
				}else{
						const ret = JSON.parse(data)
						return of(this.responseHandler(ret, exchange, today))
				}
		}

		responseHandler(response:any,exchange:IExchange,today:string):IRate{

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
				this.pairs = ret
				//Return only the request rate
				return  ret[exchange.To]
		}

		filterDays(rates:RawData):RawData{
				//Sort the keys to ensure the filter gets only the last day of the
				const keys = Object.keys(rates).sort()
				const months:RawData = {} as RawData
				//Use FOR loop instead of FOREACH for better performance
				//Filter for the last of the months
				for( let i = 0; i < keys.length; i++) {
						const key = keys[i]
						const elt:DataElement = rates[key]
						const month = moment(key).format("MM")
						months[month] = elt
				}
				//Make the history data
				return months
		}

		getRates$():Observable<ICurrencyPair>{
				this.pairs$.next(this.pairs)
				return this.pairs$
		}


		getHistory$():Observable<IChartData> {
				this.historicalRates$.next(this.historicalRates)
				return this.historicalRates$
		}

}
