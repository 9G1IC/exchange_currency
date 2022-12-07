import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
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

import {ApiInterceptor} from './interceptor/api.interceptor';
import {ErrorInterceptor} from './interceptor/error.interceptor';
import { SanitizerPipe } from './pipes/sanitizer.pipe';

import { AppComponent } from './app.component';
import { ChartComponent } from './components/chart/chart.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RatesComponent } from './components/rates/rates.component';
import { RateComponent } from './components/rate/rate.component';
import { MainComponent } from './components/main/main.component';
import { InputComponent } from './components/input/input.component';

import { RouteReuseStrategy } from '@angular/router';
import { DefaultRouteReuseStrategy } from './services/utility/router.service';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS

@NgModule({
		declarations: [
				AppComponent,
				ChartComponent,
				FooterComponent,
				HeaderComponent,
				RatesComponent,
				RateComponent,
				MainComponent,
				InputComponent,
				SanitizerPipe
		],
		imports: [
				BrowserModule,
				AppRoutingModule,
				BrowserAnimationsModule,
				FormsModule,
				ReactiveFormsModule,
				HttpClientModule,


				MatSelectModule,
				MatButtonModule,
				MatFormFieldModule,
				MatInputModule,
				MatIconModule,
				MatCardModule,
				MatToolbarModule,
				MatGridListModule,
				MatProgressBarModule,

				PlotlyModule, 
		],
		providers: [
				{provide: HTTP_INTERCEPTORS, useClass:ApiInterceptor, multi:true},//Add ApiKey
				{provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true},//Intercept Errors
				{provide:RouteReuseStrategy, useClass:DefaultRouteReuseStrategy }

		],
		bootstrap: [AppComponent]
})
export class AppModule { }
