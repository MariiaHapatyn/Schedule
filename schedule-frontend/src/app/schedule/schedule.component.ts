import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { getUserInitials } from "../common/models/functions";
import { User } from "../common/models/models";

import { AuthService } from "../auth/services/auth.service";

@Component({
	selector: "schedule-schedule-root",
	template: `
		<div class="p-3">
			<router-outlet>
			</router-outlet>
		</div>
	`
})
export class ScheduleComponent implements OnInit {
	private authService: AuthService;

	currentUser: User;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	ngOnInit(): void {
		if (this.isLoggedIn()) {
			this.authService.getCurrentUser()
				.subscribe((user: User) => this.currentUser = user);
		}
	}

	currentUserInitials(): Observable<string> {
		return this.authService.getCurrentUser()
			.map(user => getUserInitials(user))
			.first();
	}

	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
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

	isInRole(role: string): boolean {
		return this.currentUser &&
			this.currentUser.authorities.find(a => a.name === role) as any;
	}
}
