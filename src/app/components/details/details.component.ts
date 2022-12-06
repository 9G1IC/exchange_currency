import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class DetailsComponent implements OnInit,OnDestroy {

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
				   ngOnInit(): void {
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
						   const sub$ = this.exchangeService.getLatest$()
						   .subscribe((exchange:IExchange)=>{
								   //Update the amount
								   this.exchange.Amount = exchange.Amount
						   })
						   this.destroyer.push(sub$)
						   //Get the latest exchange from the getLatest$ stream
						   //and merge it with the getHistory$ stream
						   
						   const sub$ = this.exchangeService.getHistory$()
						   .subscribe((history:Record<string,number>)=>{
								   this.chartTitle = `Currency History: ${exchange.From} - ${exchange.To}`
								   this.pageTitle = `${exchange.From} - ${CurrencyNames[exchange.From]}`
						   })
						   this.destroyer.push(sub$)
				   }

}


