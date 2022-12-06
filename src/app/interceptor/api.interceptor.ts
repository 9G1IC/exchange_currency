import { Injectable } from '@angular/core';
import {
		HttpRequest,
		HttpHandler,
		HttpEvent,
		HttpInterceptor,
		HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

		constructor() {}

		intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
				const key = environment.apiKey
				const headers = new HttpHeaders().set("apikey",key)
				const clone = request.clone({
						headers
				})
				//return next.handle(clone)
				return next.handle(request);
		}
}
