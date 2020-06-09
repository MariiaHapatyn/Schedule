import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { LecturerComponent } from "./lecturer.component";

import { HomeComponent } from "./components/home.component";
import { WishesComponent } from "./components/wishes.component";
import { WishModalComponent } from "./components/wish-modal.component";

@NgModule({
	declarations: [
		LecturerComponent,
		HomeComponent,
		WishesComponent,
		WishModalComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		NgbModalModule,
		AuthModule,
		RoutesModule
	],
	entryComponents: [
		WishModalComponent
	]
})
export class LecturerModule { }
