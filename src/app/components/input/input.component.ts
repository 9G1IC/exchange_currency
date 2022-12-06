import { Component, EventEmitter, Input, Output, ɵɵpureFunction0 } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Currency, IExchange, IRate} from 'src/app/types/currency';

@Component({
		selector: 'app-input',
		templateUrl: './input.component.html',
		styleUrls: ['./input.component.css']
})
export class InputComponent {

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


}
