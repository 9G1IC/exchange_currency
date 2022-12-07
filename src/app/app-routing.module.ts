import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChartComponent} from './components/chart/chart.component';
import {InputComponent} from './components/input/input.component';
import {MainComponent} from './components/main/main.component';
import {RatesComponent} from './components/rates/rates.component';


const routes: Routes = [
		{
				path:"",
				component:MainComponent,
				children:[
						{
								path:"",
								component:InputComponent
						},
						{
								path:"chart",
								outlet:'chart',
								component:ChartComponent
						},
						{
								path:"rates",
								outlet:'rates',
								component:RatesComponent
						}
				]
		},
];

@NgModule({
		imports: [RouterModule.forRoot(routes)],
		exports: [RouterModule]
})
export class AppRoutingModule { }
