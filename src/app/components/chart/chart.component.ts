import { Component, Input, OnChanges } from '@angular/core';
import {MONTHS} from 'src/app/types/utility';

@Component({
		selector: 'app-chart',
		templateUrl: './chart.component.html',
		styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
		public graph: Record<string,any> = {};

		@Input()
		ys:number[] = []

		@Input()
		title:string=""

		constructor(){

		}

		ngOnChanges(): void {
				this.graph = {
						data: [
								{
										x: MONTHS,
										y: this.ys,
										type:'bar'
								},
						],
						layout: {title:this.title}
				}
		}

}
