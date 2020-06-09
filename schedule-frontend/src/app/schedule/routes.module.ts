import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ScheduleComponent } from "./schedule.component";

import { GroupsComponent } from "./components/groups.component";
import { LecturersComponent } from "./components/lecturers.component";
import { GroupComponent } from "./components/group.component";
import { LecturerComponent } from "./components/lecturer.component";

const routes: Routes = [
	{
		path: "schedule",
		component: ScheduleComponent,
		children: [
			{ path: "groups", component: GroupsComponent },
			{ path: "lecturers", component: LecturersComponent },
			{ path: "group/:id", component: GroupComponent },
			{ path: "lecturer/:id", component: LecturerComponent },
			{ path: "", redirectTo: "groups", pathMatch: "full" }
		]
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
