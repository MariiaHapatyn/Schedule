import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { StartPageGuard } from "./auth/auth";

import { StartPageComponent } from "./start-page.component";

const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		component: StartPageComponent,
		canActivate: [ StartPageGuard ]
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class RoutesModule { }
