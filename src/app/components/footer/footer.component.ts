import { Component } from '@angular/core';

@Component({
		selector: 'app-footer',
		templateUrl: './footer.component.html',
		styleUrls: ['./footer.component.css']
})
export class FooterComponent {
		title: string = "Banque Misr, "
		year: number = 0
		constructor(){
				this.year = new Date().getFullYear()
		}

}
