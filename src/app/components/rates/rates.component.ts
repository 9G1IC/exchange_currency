import { Component, Input } from '@angular/core';
import {IRate} from 'src/app/types/currency';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent {

		@Input()
		rates:IRate[] = []

		constructor(){
		}
}
