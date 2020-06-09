import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EditorComponent } from "./editor.component";

import { ScheduleComponent } from "./components/schedule/schedule.component";
import { PlansComponent } from "./components/plans/plans.component";
import { GroupsComponent } from "./components/groups/groups.component";

import { AuthGuard, EditorGuard } from "../auth/auth";

const routes: Routes = [
	{
		path: "editor",
		component: EditorComponent,
		children: [
			{ path: "schedule", component: ScheduleComponent },
			{ path: "plans", component: PlansComponent },
			{ path: "groups", component: GroupsComponent },
			{ path: "", component: ScheduleComponent, pathMatch: "full" }
		],
		canActivate: [ AuthGuard, EditorGuard ],
		canActivateChild: [ AuthGuard, EditorGuard ]
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
