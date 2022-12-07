import { Injectable } from '@angular/core';
import { RouteReuseStrategy,ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

@Injectable({
		providedIn: 'root'
})
export class DefaultRouteReuseStrategy implements RouteReuseStrategy {
		shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }

		store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void { }

		shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }

		retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }

		shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
				const ret =  future.routeConfig === curr.routeConfig;
				return ret
		}
}
