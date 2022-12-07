import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {IUrlParams} from 'src/app/types/currency';
import {SourceDef} from 'src/app/types/utility';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css','./main-mobile.component.css']
})
export class MainComponent implements OnInit {
		public destroyer$:Subscription = {} as Subscription
		public route:SourceDef = SourceDef.MAIN 

		constructor(private router:ActivatedRoute){
		}

		ngOnInit():void{

				this.destroyer$ = this.router.queryParams.subscribe(params=>{
						this.navigationHandler(params)
				})
		}

		navigationHandler(params:IUrlParams):void{
				this.route = params.Source as SourceDef
		}
}
