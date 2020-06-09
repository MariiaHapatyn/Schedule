import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LecturerComponent } from "./lecturer.component";

import { HomeComponent } from "./components/home.component";
import { WishesComponent } from "./components/wishes.component";

import { AuthGuard, LecturerGuard } from '../auth/auth';

const routes: Routes = [
	{
		path: "lecturer",
		component: LecturerComponent,
		children: [
			{ path: "wishes", component: WishesComponent },
			{ path: "", component: HomeComponent, pathMatch: "full" }
		],
		canActivate: [ AuthGuard, LecturerGuard ],
		canActivateChild: [ AuthGuard, LecturerGuard ]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class RoutesModule { }
