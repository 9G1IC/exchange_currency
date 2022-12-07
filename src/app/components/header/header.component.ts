import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ExchangeService} from 'src/app/services/exchange/exchange.service';
import {InputService} from 'src/app/services/input/input.service';
import {SourceDef} from 'src/app/types/utility';

@Component({
		selector: 'app-header',
		templateUrl: './header.component.html',
		styleUrls: ['./header.component.css','./header-mobile.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
		title:string = "Currency Exchanger"
		usdTitle:string = "EUR - USD Details"
		gbpTitle:string = "EUR - GBP Details"
		logo:string = "https://clipground.com/images/placeholder-logo-5.png"

		destroyer:Subscription = {} as Subscription

		constructor(private inputService:InputService, private exchangerService:ExchangeService) {

		}

		ngOnInit(): void {
				this.destroyer = this.exchangerService.getPageTitle$()
				.subscribe(title=>{
						this.title = title
				})
		}

		ngOnDestroy(): void {
			this.destroyer.unsubscribe()
		}

		goto(from:string,to:string):void {
				this.inputService.goHome({
						From:from,
						To:to,
						Source:SourceDef.HEADER
				})
		}

		usd():void{
				this.goto('EUR', 'USD')
		}

		gbp():void{
				this.goto('EUR', 'GBP')
		}

		goHome():void{
				this.inputService.goHome({ })
		}
}
