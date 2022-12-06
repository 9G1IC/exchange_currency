import { Component, Input, OnChanges } from '@angular/core';
import {UtilityService} from 'src/app/services/utility/utility.service';
import {Currency, IRate} from 'src/app/types/currency';

@Component({
		selector: 'app-rate',
		templateUrl: './rate.component.html',
		styleUrls: ['./rate.component.css','./rate-mobile.component.css']
})
export class RateComponent implements OnChanges {

		public flag:string = ""
		public currency:Currency = Currency.EUR
		public base:Currency = Currency.USD

		@Input('rate')
		rate:IRate = { } as IRate

		constructor(private utilityService: UtilityService){
		}

		ngOnChanges() {
				//Recalcualte the flag
				this.flag = this.utilityService.getSymbol(this.rate.currency)
		}
}
