import { Component } from "@angular/core";

@Component({
	selector: "schedule-root",
	template: `
		<schedule-navigation></schedule-navigation>
		<router-outlet></router-outlet>
	`
})
export class AppComponent { }
