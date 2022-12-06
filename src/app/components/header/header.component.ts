import { Component } from '@angular/core';
import {InputService} from 'src/app/services/input/input.service';
import {SourceDef} from 'src/app/types/utility';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css','./header-mobile.component.css']
})
export class HeaderComponent {

		constructor(private inputService:InputService) {

		}

		toDetail(from:string,to:string):void {
				this.inputService.gotoDetail({
						from,
						to,
						source:SourceDef.HEADER
				})
		}
}
