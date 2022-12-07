import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { CurrencyNames, IUrlParams} from 'src/app/types/currency';
import {SourceDef} from 'src/app/types/utility';

@Component({
		selector: 'app-main',
		templateUrl: './main.component.html',
		styleUrls: ['./main.component.css','./main-mobile.component.css']
})
export class MainComponent implements OnInit  {
		public destroyer$:Subscription = {} as Subscription
		public route:SourceDef = SourceDef.MAIN 
		public headerTitle:string = "Currency Exchanger"

		constructor(private router:ActivatedRoute){
		}


		ngOnInit():void{
				this.destroyer$ = this.router.queryParams.subscribe(params=>{
						const p:IUrlParams = {
								From:params['From'],
								To:params['To'],
								Source:params['Source'],
								Amount:params['Amount'],
								Rate:params['Rate']
						}
						this.navigationHandler(p)
				})
		}


		navigationHandler(params:IUrlParams):void{
				switch(params.Source){
						case SourceDef.MAIN:
								this.route = SourceDef.MAIN
						break
						case SourceDef.DETAIL:
								this.route = SourceDef.DETAIL
						break
				}
				if(this.route === SourceDef.DETAIL){
						this.headerTitle = `${params.From} - ${CurrencyNames[params.From]} `
				}else{
						this.headerTitle = "Currency Exchanger"
				}
		}
}
