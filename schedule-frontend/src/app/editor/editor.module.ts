import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DragDropDirectiveModule} from "angular4-drag-drop";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { EditorComponent } from "./editor.component";

import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ViewComponent } from "./components/schedule/view/view.component";
import { ClassModalComponent } from "./components/schedule/class-modal.component";

import { GroupsComponent } from "./components/groups/groups.component";
import { GroupModalComponent } from "./components/groups/group-modal.component";

import { PlansComponent } from "./components/plans/plans.component";
import { PlanModalComponent } from "./components/plans/plan-modal.component";
import { ScheduleService } from "./services/schedule.service";
import { DragAndDropService } from "./services/drag-and-drop.service";
import { ViewService } from "./services/view.service";
import { AvailableClassesComponent } from "./components/schedule/available_classes/available-classes.component";
import { AvailableClassesService } from "./services/available-classes.service";
import { AnalyserComponent } from "./components/schedule/analyser/analyser.component";
import { AnalyzerService } from "./services/analyser.service";
import { AnalyserSettingsComponent } from "./components/schedule/analyser/settings/settings.component";

@NgModule({
	declarations: [
		EditorComponent,
		ScheduleComponent,
		ViewComponent,
		AvailableClassesComponent,
		ClassModalComponent,
		GroupsComponent,
		GroupModalComponent,
		PlansComponent,
		PlanModalComponent,
		AnalyserComponent,
		AnalyserSettingsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		NgbModalModule,
		NgbModule,
		DragDropDirectiveModule,
		AuthModule,
		RoutesModule
	],
	entryComponents: [
		ClassModalComponent,
		GroupModalComponent,
		PlanModalComponent,
		ViewComponent,
		AvailableClassesComponent,
		AnalyserComponent,
		AnalyserSettingsComponent
	],
	providers: [
		ScheduleService,
		ViewService,
		DragAndDropService,
		AvailableClassesService,
		AnalyzerService
	]
})
export class EditorModule { }
