import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { NavigationComponent } from "./navigation.component";
import { StartPageComponent } from "./start-page.component";

import { AuthModule } from "./auth/auth";
import { ScheduleModule } from "./schedule/schedule";
import { LecturerModule } from "./lecturer/lecturer";
import { EditorModule } from "./editor/editor";
import { AdminModule } from "./admin/admin";
import { RoutesModule } from "./routes.module";

import * as services from "./common/services/services";

@NgModule({
	declarations: [
		AppComponent,
		NavigationComponent,
		StartPageComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		NgbModule.forRoot(),
		AuthModule,
		ScheduleModule,
		LecturerModule,
		EditorModule,
		AdminModule,
		RoutesModule
	],
	providers: [
		services.BuildingService,
		services.ClassService,
		services.ClassroomService,
		services.ClassroomTypeService,
		services.FacultyService,
		services.DepartmentService,
		services.GroupService,
		services.UserService,
		services.PlanService,
		services.SubjectService,
		services.WishService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
