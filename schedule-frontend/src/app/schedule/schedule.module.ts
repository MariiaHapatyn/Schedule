import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { RoutesModule } from "./routes.module";

import { ScheduleComponent } from "./schedule.component";

import { GroupsComponent } from "./components/groups.component";
import { LecturersComponent } from "./components/lecturers.component";
import { GroupComponent } from "./components/group.component";
import { LecturerComponent } from "./components/lecturer.component";

@NgModule({
	declarations: [
		ScheduleComponent,
		GroupsComponent,
		LecturersComponent,
		GroupComponent,
		LecturerComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		RoutesModule
	]
})
export class ScheduleModule { }
