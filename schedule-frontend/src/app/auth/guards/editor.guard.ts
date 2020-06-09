import  { Injectable } from "@angular/core";
import {
	CanActivate, CanActivateChild, Router,
	ActivatedRouteSnapshot, RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../services/auth.service";

import { User } from "../../common/models/models";

@Injectable()
export class EditorGuard implements CanActivate, CanActivateChild {
	private router: Router;
	private authService: AuthService;

	constructor(router: Router, authService: AuthService) {
		this.router = router;
		this.authService = authService;
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> {
		return this.authService.getCurrentUser()
			.map((currentUser: User) => {
				if (currentUser && currentUser.authorities.find(
						a => a.name == "ROLE_EDITOR")) {
					return true;
				}

				this.authService.setReturnUrl(state.url);
				this.router.navigate([ "/login" ]);

				return false;
			});
	}

	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> {
		return this.canActivate(route, state);
	}
}
