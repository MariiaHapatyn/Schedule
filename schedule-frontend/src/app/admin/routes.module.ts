import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "./admin.component";

import { UsersComponent } from "./components/users.component";
import { FacultiesComponent } from "./components/faculty/faculties.component";
import { SubjectsComponent } from "./components/subject/subjects.component";
import { ClassroomsComponent } from "./components/classroom/classrooms.component";

import { AuthGuard, AdminGuard } from "../auth/auth";

const routes: Routes = [
	{
		path: "admin",
		component: AdminComponent,
		children: [
			{ path: "faculties", component: FacultiesComponent },
			{ path: "subjects", component: SubjectsComponent },
			{ path: "classrooms", component: ClassroomsComponent },
			{ path: "", component: UsersComponent, pathMatch: "full" }
		],
		canActivate: [ AuthGuard, AdminGuard ],
		canActivateChild: [ AuthGuard, AdminGuard ]
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
