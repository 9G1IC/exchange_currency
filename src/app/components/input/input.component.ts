import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExchangeService} from 'src/app/services/exchange/exchange.service';
import {InputService} from 'src/app/services/input/input.service';
import {CURRENCIES, Currency, ICurrencyPair, IExchange, IRate} from 'src/app/types/currency';
import {PageDef, SourceDef} from 'src/app/types/utility';

@Component({
		selector: 'app-input',
		templateUrl: './input.component.html',
		styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnDestroy {

		//Reactive Form Variables
		public inputForm: FormGroup = new FormGroup({
				from:new FormControl<Currency>(Currency.EUR,[Validators.required]),
				to:new FormControl<Currency>(Currency.USD,[Validators.required]),
				amount: new FormControl<number>(1,[Validators.required,Validators.pattern('')])
		})
		//Currency Variables
		public exchange: IExchange = { } as IExchange
		public currencies:string[] = []
		public amount:number = 0 
		public rate:IRate = { } as IRate
		public title:string = "Currency Exchanger Input"

		@Input()
		externalRate:IRate = {} as IRate
		@Input()
		externalExchange:IExchange = {} as IExchange

		@Output()
		rateStream:EventEmitter<Record<string,IRate|IExchange>> = new EventEmitter()
		@Output()
		otherRateStream:EventEmitter<IRate[]> = new EventEmitter()

		//Button Variables
		public detailButtonText:string="More Details"
		public convertButton:boolean = false;
		public detailButton:boolean = true;//Hide detail till conversion
		public swapButton:boolean = true;//Disable

		//Others
		public isLoading = false
		public currentPage:PageDef = PageDef.MAIN
		//Subscription
		public destroyer:Subscription[] = []

		constructor(
				private inputService: InputService,
				private exchangeService: ExchangeService,
				private router:ActivatedRoute
		){
				//Setup currencies for dropdown menu
				this.currencies = CURRENCIES.split(",").map(c=>c.trim())
				this.rate = {
						base:Currency.EUR,
						currency:Currency.USD,
						amount:0,
						rate:0,
				}
				this.exchange = {
						From:Currency.EUR,
						To:Currency.USD,
						Amount:1,
				}
		}

		//
		//
		//
		//Life cycle Hooks
		//
		//
		//
		ngOnInit(): void{
				this.registerFormChanges()
				this.pageSetup()
		}

		ngOnDestroy(): void {
				this.destroyer.forEach(sub$=>sub$.unsubscribe())
		}
		////// END OF LIFECYCLE /////

		//
		//
		//
		//INITIALIZATIONS
		//
		//
		//
		//

		pageSetup():void{
				const sub$ = this.router.queryParams.subscribe(params=>{
						const source = params['source']

						switch(source){
								case SourceDef.DETAIL:
										this.currentPage = PageDef.MAIN //We are from detail to main

								const from = params['from']
								const to = params['to']
								const amount = params['amount']

								this.exchange.From = from
								this.exchange.To = to
								this.exchange.Amount = amount

								this.setForm(this.exchange)
								break

								case SourceDef.HEADER:
										case SourceDef.MAIN:
										this.currentPage = PageDef.DETAIL //We are from main to detail

						}

						this.initButtons()
				})
				this.destroyer.push(sub$)
		}
		//Setup the button state 
		initButtons():void{
				switch(this.currentPage){
						case PageDef.MAIN:
								this.convertButton = true;
						this.detailButton = true;
						this.swapButton = false;
						this.inputForm.controls['amount'].enable()
						this.inputForm.controls['from'].enable()
						this.inputForm.controls['to'].enable()
						this.detailButtonText = "More Details"

						break
						case PageDef.DETAIL:
								this.convertButton = false;
						this.detailButton = false;
						this.swapButton = true;
						this.inputForm.controls['amount'].disable()
						this.inputForm.controls['from'].disable()
						this.inputForm.controls['to'].enable()
						this.detailButtonText = "Home"
						break
				}
		}

		//
		//
		//
		//
		//FORM HELPER FUNCTIONS
		//
		//
		// 
		//
		extractRate(raw:IRate):void{
				this.rate.rate = raw.rate
				this.rate.base = raw.base
				this.rate.currency = raw.currency
				this.rate.amount = raw.amount || 0
		}

		extractExchange(raw:IExchange):void{
				this.exchange.From = raw.From
				this.exchange.To = raw.To
				this.exchange.Amount = raw.Amount || 0

				this.setForm(raw)
		}

		setForm(raw:IExchange):void{
				this.inputForm.patchValue({
						from:raw.From,
						to:raw.To,
						amount:raw.Amount
				})
		}

		//Register changes on form
		registerFormChanges():void{
				const sub1$ = this.inputForm.controls['amount'].valueChanges.subscribe(value=>{
						this.convertButton = false
						this.exchange.Amount = value
				})
				this.destroyer.push(sub1$)

				const sub2$ = this.inputForm.controls['from'].valueChanges.subscribe(value=>{
						this.exchange.From = value
				})
				this.destroyer.push(sub2$)

				const sub3$ = this.inputForm.controls['from'].statusChanges.subscribe(status=>{
						switch(status){
								case 'DISABLED':
										this.swapButton = true
								break
								default:
										this.swapButton = false
						}
				})
				this.destroyer.push(sub3$)

				const sub4$ = this.inputForm.controls['to'].valueChanges.subscribe(value=>{
						this.exchange.To = value
				})
				this.destroyer.push(sub4$)
		}

		//
		//
		//Event Handlers
		//
		//
		//

		//Swap Methods
		onSwap():void{
				const from = this.inputForm.value.from
				const to = this.inputForm.value.to

				this.inputForm.patchValue({
						from:to,
						to:from
				})
		}

		//Sends data to fixer.io, also called from parent component, there it accepts an optional parameter
		onConvert(exchange?:IExchange):void{
				this.isLoading= true//Show the loader
				if(exchange) {
						this.exchange = exchange
						//Update the Ui
						this.setForm(exchange)
				}

				const sub$ = this.exchangeService.getRate$(this.exchange)
				.subscribe((rates:ICurrencyPair)=>{
						const curr:Currency = this.exchange.To
						this.rate = rates[curr]
						//Update the Ui
						this.isLoading = false //Hide the loader
						this.detailButton = false
						//Activate Detail View
						this.inputService.showRates()
				},()=>{
						this.isLoading = false
				})

				this.destroyer.push(sub$)
		}

		//Handle navigation 
		navigate():void{
				switch(this.currentPage){
						case PageDef.MAIN:
								this.inputService.gotoDetail({
								From:this.exchange.From,
								To:this.exchange.To,
								Amount:this.exchange.Amount,
								Rate:this.rate.rate,
								Source:SourceDef.MAIN
						})
						break

						case PageDef.DETAIL:
								this.inputService.goHome({
								From:this.exchange.From,
								To:this.exchange.To,
								Amount:this.exchange.Amount,
								Source:SourceDef.DETAIL
						})
						break
				}
		}

}
