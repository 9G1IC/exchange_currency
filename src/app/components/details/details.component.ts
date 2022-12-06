import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExchangeService} from 'src/app/services/exchange/exchange.service';
import {Currency, CurrencyNames, IExchange, IRate} from 'src/app/types/currency';
import {SourceDef} from 'src/app/types/utility';
import {InputComponent} from '../input/input.component';

@Component({
		selector: 'app-details',
		templateUrl: './details.component.html',
		styleUrls: ['./details.component.css','./detail-mobile.component.css']
})
export class DetailsComponent implements AfterViewInit,OnDestroy {

		public rate:IRate = {
				base:Currency.EUR,
				currency:Currency.USD,
				amount:0,
				rate:0
		}
		public chartData:number[] = []
		public chartTitle:string=""
		public pageTitle:string=""
		public exchange:IExchange = {
				From:Currency.EUR,
				To:Currency.USD,
				Amount:1
		}

		//Other Variables
		public destroyer:Subscription[] = []

		//Create view child of input Component to acess thie convert method
		@ViewChild('detailInput')
		detailInput:InputComponent = {}  as InputComponent


		constructor(private router: ActivatedRoute,
					private cd:ChangeDetectorRef,
					private exchangeService: ExchangeService
				   ){

				   }

				   //
				   //
				   //
				   //LIFECYCLE HOOKS 
				   //
				   //
				   //
				   ngAfterViewInit(): void {
						   const sub$ = this.router.queryParams.subscribe(params=>{
								   this.navigationHandler(params)
						   })	

						   this.destroyer.push(sub$)
						   //This method updates the view after the life cycle hook, so we need to trigger another change detection
						   this.cd.detectChanges()
				   }

				   ngOnDestroy(): void {
						   this.destroyer.forEach(sub$=>sub$.unsubscribe())
				   }
				   ////// END OF LIFECYCLE ///////

				   //
				   //
				   //
				   //
				   //METHODS
				   //
				   //
				   //
				   //
				   navigationHandler(params:any):void {
						   const base:Currency = params['from'] as Currency
						   const to:Currency = params['to'] as Currency
						   const source:SourceDef = params['source'] as SourceDef
						   const amount = Number(params['amount'])
						   const rate_ = Number(params['rate'])

						   this.exchange = {
								   From:base,
								   To:to,
								   Amount:amount
						   }

						   switch(source) {
								   case SourceDef.MAIN:
										   this.updateRateWithChart(rate_)
								   break
								   //From Header
								   case SourceDef.HEADER:
										   this.getAmount$() //Get amount exchange service because it is not passed fron the header component
								   this.detailInput.onConvert(this.exchange)//Use the child view to convert the exchange
								   break
						   }
				   }

				   //
				   //
				   //Rate methods
				   //
				   //
				   //
				   getAmount$():void{
						   const sub$ = this.exchangeService.getLatest$()
						   .subscribe((exchange:IExchange)=>{
								   //Update the amount
								   this.exchange.Amount = exchange.Amount
						   })
						   this.destroyer.push(sub$)
				   }

				   initRate(rate:number):void {
						   this.rate.rate = rate
						   this.rate.base = this.exchange.From
						   this.rate.currency = this.exchange.To

						   const total = Number(this.rate.rate * this.exchange.Amount).toFixed(6)
						   this.rate.amount = Number(total)
						   //UPDATE THE CHILD COMPONENT VIEW
						   this.detailInput.updateRate(this.rate)
				   }

				   updateRateWithChart(rate:number):void {
						   this.initRate(rate)
						   this.initChart(this.exchange)
				   }

				   goUpdateRate(args:Record<string,IRate | IExchange>):void {
						   this.exchange = args['exchange'] as IExchange
						   const rate:IRate = args['rate'] as IRate
						   this.updateRateWithChart(rate.rate)
				   }

				   //
				   //
				   //
				   //Chart Methods
				   //
				   //
				   //
				   initChart(exchange:IExchange):void{
						   const sub$ = this.exchangeService.getHistory$(exchange)
						   .subscribe(rates=>{
								   //Rest the chart data
								   this.chartData = []
								   //Get the of the history
								   const months = Object.keys(rates).sort()

								   for(let i = 0; i < months.length; i++){
										   const month = months[i]
										   const data = rates[month]
										   const value = data[exchange.To]
										   this.chartData.push(value)
								   }
								   this.chartTitle = `Currency History: ${exchange.From} - ${exchange.To}`
								   this.pageTitle = `${exchange.From} - ${CurrencyNames[exchange.From]}`
						   })
						   this.destroyer.push(sub$)
				   }

				   goUpdateChart(exchange: IExchange):void {
						   this.initChart(exchange)
				   }
}


