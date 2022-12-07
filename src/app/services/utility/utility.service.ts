import { Injectable } from '@angular/core';
import {Currency} from 'src/app/types/currency';

@Injectable({
		providedIn: 'root'
})
export class UtilityService {

		constructor() { }

		//This method convert currency enums to their html symbols
		getSymbol(currency: Currency){
				let sym = ""
				switch(currency){
						case Currency.USD:
								sym =  "&#36;"
						break
						case Currency.EUR:
								sym = "&#128;"
						break
						case Currency.JPY:
								sym = "&#165;"
						break
						case Currency.GBP:
								sym = "&#163;"
						break
						case Currency.AUD:
								sym = "&#8371;"
						break
						case Currency.CAD:
								sym = "&#x24;"
						break
						case Currency.CHF:
								sym = "&#x20A3;"
						break
						case Currency.CNY:
								sym = "&#x5143;"
						break
						case Currency.HKD:
								sym = "&#x5713;"
						break
				}

				return sym
		}
}
