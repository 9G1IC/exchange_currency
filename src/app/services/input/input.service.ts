import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {IUrlParams} from 'src/app/types/currency';

@Injectable({
		providedIn: 'root'
})
export class InputService {

		constructor(private router: Router) { }

		gotoDetail(params?: IUrlParams) {
				this.showDetail(params)
		}

		goHome(params?:IUrlParams) {
				this.showRates(params)
		}

		showDetail(params?:IUrlParams) {
				this.router.navigate(['main',{outlets:{chart:['chart']}}],{queryParams:params})
		}

		showRates(params?:IUrlParams) {
				this.router.navigate(['main',{outlets:{rates:['rates']}}],{queryParams:params})
		}
}
