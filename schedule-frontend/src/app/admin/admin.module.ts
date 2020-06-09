import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { AdminComponent } from "./admin.component";

import { UsersComponent } from "./components/users.component";

import { FacultiesComponent } from "./components/faculty/faculties.component";
import { FacultyModalComponent } from "./components/faculty/faculty-modal.component";
import { DepartmentModalComponent } from "./components/faculty/department-modal.component";

import { ClassroomsComponent } from "./components/classroom/classrooms.component";
import { BuildingModalComponent } from "./components/classroom/building-modal.component";
import { ClassroomModalComponent } from "./components/classroom/classroom-modal.component";
import { ClassroomTypeModalComponent } from "./components/classroom/classroom-type-modal.component";

import { SubjectsComponent } from "./components/subject/subjects.component";
import { SubjectModalComponent } from "./components/subject/subject-modal.component";
import { UserModalComponent } from "./components/user-modal.component";

@NgModule({
	declarations: [
		AdminComponent,
		UsersComponent,
		FacultiesComponent,
		FacultyModalComponent,
		DepartmentModalComponent,
		ClassroomsComponent,
		BuildingModalComponent,
		ClassroomModalComponent,
		ClassroomTypeModalComponent,
		SubjectsComponent,
		SubjectModalComponent,
		UserModalComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		NgbModalModule,
		NgbModule,
		AuthModule,
		RoutesModule
	],
	entryComponents: [
		BuildingModalComponent,
		ClassroomModalComponent,
		ClassroomTypeModalComponent,
		FacultyModalComponent,
		DepartmentModalComponent,
		SubjectModalComponent,
		UserModalComponent
	]
})
export class AdminModule { }
