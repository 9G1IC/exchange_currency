import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {InputService} from 'src/app/services/input/input.service';
import {Currency} from 'src/app/types/currency';
import {SourceDef} from 'src/app/types/utility';

@Component({
		selector: 'app-header',
		templateUrl: './header.component.html',
		styleUrls: ['./header.component.css','./header-mobile.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
		@Input()
		title:string = ""
		usdTitle:string = "EUR - USD Details"
		gbpTitle:string = "EUR - GBP Details"
		logo:string = "https://clipground.com/images/placeholder-logo-5.png"

		destroyer:Subscription = {} as Subscription



		constructor(private inputService:InputService) {
		}



		ngOnInit(): void {
		}

		ngOnDestroy(): void {
			this.destroyer.unsubscribe()
		}

		goto(from:Currency,to:Currency):void {
				this.inputService.goHome({
						From:from,
						To:to,
						Source:SourceDef.HEADER
				})
		}

		usd():void{
				this.goto(Currency.EUR, Currency.USD)
		}

		gbp():void{
				this.goto(Currency.EUR, Currency.GBP)
		}

		goHome():void{
				this.inputService.goHome()
		}
}
