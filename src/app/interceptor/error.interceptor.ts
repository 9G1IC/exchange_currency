import { Injectable } from '@angular/core';
import {
		HttpRequest,
		HttpHandler,
		HttpEvent,
		HttpInterceptor,
		HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

		constructor() {}

		intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
				return next.handle(request)
				.pipe(
						catchError((error:HttpErrorResponse)=>{
								let errorMessage = ""
								if(error.error instanceof ErrorEvent) {
										//Error is from the client
										errorMessage = `Error: ${error.error.message}`
								}else{
										//Server side Error
										errorMessage = `Error Code: ${error.status} \n Message: ${error.message}`

								}
								window.alert(errorMessage)
								return throwError(errorMessage)
						})
				)
		}
}
