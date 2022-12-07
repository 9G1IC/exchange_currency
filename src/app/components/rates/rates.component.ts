import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ExchangeService} from 'src/app/services/exchange/exchange.service';
import {ICurrencyPair, IRate} from 'src/app/types/currency';

@Component({
		selector: 'app-rates',
		templateUrl: './rates.component.html',
		styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit, OnDestroy{

		public destroyer$:Subscription = {} as Subscription
		public rates:IRate[] = []


		constructor(private router:ActivatedRoute,
					private exchangeService:ExchangeService){

					}

					ngOnInit(): void {

							this.destroyer$ = this.router.queryParams.subscribe(()=>{
									return this.navigationHandler()
							})

					}
					ngOnDestroy(): void {
							this.destroyer$.unsubscribe()
					}

					navigationHandler():Subscription {
							return this.exchangeService.getRates$()
							.subscribe((pairs:ICurrencyPair)=>{
									this.rates = Object.values(pairs)
							})
					}
}
