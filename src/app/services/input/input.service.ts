import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
		providedIn: 'root'
})
export class InputService {

		constructor(private router: Router) { }

		gotoDetail(params: any) {
				this.router.navigate(['chart'],{ queryParams:params })
		}

		goHome(params:any) {
				this.router.navigate([''],{queryParams:params})
		}

		showRates(params:any) {
				this.router.navigate(['rates'],{queryParams:params})
		}
}
