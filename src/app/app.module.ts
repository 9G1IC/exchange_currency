import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartComponent } from './components/chart/chart.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RatesComponent } from './components/rates/rates.component';
import { RateComponent } from './components/rate/rate.component';
import { DetailsComponent } from './components/details/details.component';
import { MainComponent } from './components/main/main.component';
import { InputComponent } from './components/input/input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { WorkareaComponent } from './components/workarea/workarea.component';

@NgModule({
		declarations: [
				AppComponent,
				ChartComponent,
				FooterComponent,
				HeaderComponent,
				RatesComponent,
				RateComponent,
				DetailsComponent,
				MainComponent,
				InputComponent,
    WorkareaComponent
		],
		imports: [
				BrowserModule,
				AppRoutingModule,
				BrowserAnimationsModule,

				MatSelectModule,
				MatButtonModule,
				MatFormFieldModule,
				MatInputModule,
				MatIconModule,
				MatCardModule,
				MatToolbarModule,
				MatGridListModule,
				MatProgressBarModule,
		],
		providers: [],
		bootstrap: [AppComponent]
})
export class AppModule { }
