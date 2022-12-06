import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExchangeService} from 'src/app/services/exchange/exchange.service';
import {CurrencyNames, IChartData} from 'src/app/types/currency';
import {MONTHS} from 'src/app/types/utility';

@Component({
		selector: 'app-chart',
		templateUrl: './chart.component.html',
		styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
		public graph: Record<string,any> = {};
		public destroyer$:Subscription = {} as Subscription
		public chartTitle:string = ""

		constructor(private router:ActivatedRoute, 
					private exchangeService:ExchangeService){
					}

					//
					//LIFECYCLE HOOKS 
					//
					ngOnInit(): void {
							this.destroyer$ = this.router.queryParams.subscribe(()=>{
									return this.navigationHandler()
							})	
					}

					ngOnDestroy(): void {
							this.destroyer$.unsubscribe()
					}

					navigationHandler():Subscription {
							return this.exchangeService.getHistory$()
							.subscribe((chartData:IChartData)=>{
									const rates = chartData.Rates
									const exchange = chartData.Exchange
									//Update the amount
									this.chartTitle = `Currency History: ${exchange.From} - ${exchange.To}`
									const pageTitle = `${exchange.From} - ${CurrencyNames[exchange.From]}`
									//Set the page title in the service 
									this.exchangeService.setPageTite(pageTitle)
									this.graph = {
											data: [
													{
															x: MONTHS,
															y:rates,
															type: 'bar' 
													},
											],
											layout: {title: this.chartTitle }
									}
							})
					}
}
