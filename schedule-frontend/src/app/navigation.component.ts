import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { getUserInitials } from "./common/models/functions";

import { AuthService } from "./auth/auth";

@Component({
	selector: "schedule-navigation",
	templateUrl: "./navigation.component.html"
})
export class NavigationComponent {
	private authService: AuthService;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	currentUserInitials(): Observable<string> {
		return this.authService.getCurrentUser()
			.map(user => getUserInitials(user))
			.first();
	}

	isAdmin(): Observable<boolean> {
		return this.authService.isAdmin();
	}

	isEditor(): Observable<boolean> {
		return this.authService.isEditor();
	}

	isLecturer(): Observable<boolean> {
		return this.authService.isLecturer();
	}

	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
	}

	isLoggingIn(): boolean {
		return this.authService.isLoggingIn();
	}
}
