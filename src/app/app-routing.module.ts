import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DetailsComponent} from './components/details/details.component';
import {InputComponent} from './components/input/input.component';
import {MainComponent} from './components/main/main.component';


const routes: Routes = [
		{
				path:"",
				component:InputComponent 
		},
		{
				path:"main",
				outlet:'input',
				component:InputComponent
		},
		{
				path:"detail",
				outlet:'detail',
				component:DetailsComponent
		}
];

@NgModule({
		imports: [RouterModule.forRoot(routes)],
		exports: [RouterModule]
})
export class AppRoutingModule { }
