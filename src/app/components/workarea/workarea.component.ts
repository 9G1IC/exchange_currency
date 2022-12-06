import { Component } from '@angular/core';
import {IRate} from 'src/app/types/currency';

@Component({
  selector: 'app-workarea',
  templateUrl: './workarea.component.html',
  styleUrls: ['./workarea.component.css']
})
export class WorkareaComponent {
		public rates:IRate[] = []

		goUpdateRates(rates: IRate[]){
				this.rates = rates
		}
}
