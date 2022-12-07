import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {IUrlParams} from 'src/app/types/currency';

@Injectable({
		providedIn: 'root'
})
export class InputService {

		constructor(private router: Router) { }

		gotoDetail(params?: IUrlParams) {
				this.clearAll()
				this.showDetail(params)
		}

		goHome(params?:IUrlParams) {
				this.clearChart()
				this.showRates(params)
		}

		showDetail(params?:IUrlParams) {
				this.router.navigate([{outlets:{chart:['chart']}}],{queryParams:params})
		}

		showRates(params?:IUrlParams) {
				this.router.navigate([{outlets:{rates:['rates']}}],{queryParams:params})
		}

		clearChart(){
				this.router.navigate([{outlets:{chart:['']}}])
		}

		clearRates(){
				this.router.navigate([{outlets:{rates:['']}}])
		}
		clearAll(){
				this.clearChart()
				this.clearRates()
		}
}
