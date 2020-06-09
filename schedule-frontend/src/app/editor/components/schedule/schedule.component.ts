import { Component, OnInit, ViewChild } from "@angular/core";

import { ClassModalComponent } from "./class-modal.component";

import { AuthService } from "../../../auth/auth";

import * as models from "../../../common/models/models";
import * as services from "../../../common/services/services";
import {
	getCurrentYear, getCurrentSemester,
	getUserInitials, getDayOfWeekName,
	getUsersAsString, getGroupsAsString, getClassroomsAsString,
	getShortName
} from "../../../common/models/functions";

import {
	ClassCell, ClassFrequency, ViewToggle,
	frequencyFromString, frequencyToString, isClassFull
} from "../helpers";
import { ViewComponent } from "./view/view.component";
import { ScheduleService } from "../../services/schedule.service";
import { AnalyserComponent } from "./analyser/analyser.component";
import { NgbModal, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { ScheduleCheckResult } from "../../models/models";
import { AnalyserSettingsComponent } from "./analyser/settings/settings.component";
import { Result } from "../../models/check_results/result";

@Component({
	selector: "schedule-editor-schedule",
	templateUrl: "./schedule.component.html"
})
export class ScheduleComponent implements OnInit {
	@ViewChild(ViewComponent)
	private view: ViewComponent;

	private dragPosition: number;
	private dragFrequency: number;
	private dragClass: models.Class;
	private dragViewObjectId: number;

	private dropPosition: number;
	private dropFrequency: number;
	private dropViewObjectId: number;

	currentUser: models.User;

	showOnlyFacultyLecturers = false;
	availableExpanded = false;

	lecturers: models.User[] = [];
	lecturersClasses: Map<number, models.Class[]> = new Map();
	lecturerWishes: Map<number, models.Wish[]> = new Map();

	groups: models.Group[] = [];
	groupsClasses: Map<number, models.Class[]> = new Map();

	availableClasses: models.Class[] = [];

	checkResult: Result;

	getDayOfWeekName = getDayOfWeekName;
	getLecturersAsString = getUsersAsString;
	getGroupsAsString = getGroupsAsString;
	getClassroomsAsString = getClassroomsAsString;
	getShortName = getShortName;

	constructor(
		private modalService: NgbModal,
		private authService: AuthService,
		private classService: services.ClassService,
		private scheduleService: ScheduleService) {
	}

	ngOnInit(): void {
		this.authService.getCurrentUser()
			.subscribe((user: models.User) => {
				this.currentUser = user;
				this.scheduleService.setFaculty(user.department.faculty.id);
				this.scheduleService.setView(ViewToggle.LECTURERS);
			});
	}

	viewToggleClass(toggle: ViewToggle): string {
		const context = this.scheduleService.viewContext;
		return toggle === context.toggle ? "active" : "";
	}

	viewExpandedClass(): string {
		return this.availableExpanded ? "expanded" : "collapsed";
	}

	changeViewType(toggle: ViewToggle) {
		this.scheduleService.setView(toggle);
	}

	openSettings() {
		const modalRef = this.modalService.open(AnalyserSettingsComponent, {size: "lg"});
		const modal = modalRef.componentInstance as AnalyserSettingsComponent;
		modal.facultyId = this.currentUser.department.faculty.id;
	}

	checkSchedule() {
		this.scheduleService.getCheckResult()
			.subscribe(checkResult => {
				const modalRef = this.modalService.open(AnalyserComponent);
				const modal = modalRef.componentInstance as AnalyserComponent;
				modal.checkResult = checkResult;
				modalRef.result.then(() => this.checkResult = modal.combinedResult,
				() => this.checkResult = modal.combinedResult);
			});
	}

	startDrag(c: models.Class): void {
		this.dragPosition = -1;
		this.dragFrequency = c.frequency === "Щотижня"
			? ClassFrequency.WEEKLY
			: c.frequency === "По чисельнику"
				? ClassFrequency.NUMERATOR
				: ClassFrequency.DENOMINATOR;
		this.dragClass = c;
		this.dragViewObjectId = null;
		this.view.showDenominator = c.frequency !== "Щотижня";
	}

	releaseDrop(c: models.Class): void {
		// if (this.dropPosition !== -1 &&
		// 	!this.canDrop(this.dropViewObjectId, this.dropPosition, this.dropFrequency)) {
		// 	this.view.showDenominator = false;
		// 	this.dragClass = null;
		// 	this.dragViewObjectId = null;
		// 	this.dropViewObjectId = null;

		// 	return;
		// }

		// let updated = [];

		// c = this.updateDroppedClass(c);

		// switch (this.viewToggle) {
		// 	case ViewToggle.GROUPS:
		// 		updated = this.updateForGroups(c);
		// 		break;
		// 	case ViewToggle.LECTURERS:
		// 		updated = this.updateForLecturers(c);
		// 		break;
		// }

		// const viewClassesAll = this.viewClassesAll;

		// for (const updatedObject of updated) {
		// 	viewClassesAll.set(updatedObject.id, this.getViewClasses(updatedObject.id));
		// }

		// this.viewClassesAll = viewClassesAll;

		// this.showDenominator = false;
		// this.dragClass = null;
		// this.dragViewObjectId = null;
		// this.dropViewObjectId = null;
	}

	addDropItem(c: models.Class, viewObject: models.User | models.Group, position: number, frequency: number): void {
		this.dropPosition = position;
		this.dropFrequency = position !== -1
			? frequency
			: frequencyFromString(c.frequency);
		this.dropViewObjectId = null;
	}

	updateDroppedClass(c: models.Class): models.Class {
		// if (this.dropPosition !== -1) {
		// 	c.dayOfWeek = getDayOfWeekName(this.getDay(this.dropPosition));
		// 	c.number = this.getNumber(this.dropPosition);
		// 	c.frequency = frequencyToString(this.dropFrequency);
		// }

		return c;
	}

	updateForGroups(c: models.Class): models.Group[] {
		this.updateAssosiated(c, c.groups);

		const action = !c.id
			? this.classService.addClass(c)
			: c.lecturers.length > 0
				? this.classService.updateClass(c)
				: this.classService.deleteClass(c.id);

		action.subscribe();
		action.connect();

		return c.groups;
	}

	updateForLecturers(c: models.Class): models.User[] {
		let lecturers = c.lecturers;

		if (this.dragPosition === -1) {
			lecturers = [this.lecturers.find(l => l.id === this.dropViewObjectId)];
			c.lecturers = lecturers;

			this.lecturersClasses.set(this.dropViewObjectId, [...this.lecturersClasses.get(this.dropViewObjectId), c]);

			for (const assosiate of c.groups) {
				this.groupsClasses.set(
					assosiate.id,
					[...this.groupsClasses.get(assosiate.id), c]);
			}

			this.availableClasses = this.availableClasses.filter(cl => cl !== c);
		} else if (this.dropPosition === -1) {
			c.lecturers = c.lecturers.filter(l => l.id !== this.dragViewObjectId);

			this.lecturersClasses.set(
				this.dragViewObjectId,
				this.lecturersClasses.get(this.dragViewObjectId).filter(cl => cl.id !== c.id));

			for (const assosiate of c.groups) {
				this.groupsClasses.set(
					assosiate.id,
					[...this.groupsClasses.get(assosiate.id).filter(cl => cl.id !== c.id)]);
			}

			if (c.lecturers.length === 0) {
				c.dayOfWeek = null;
				c.number = 0;
				c.frequency = frequencyToString(this.dragFrequency);
				this.availableClasses.push(c);
			}
		} else if (this.dragViewObjectId !== this.dropViewObjectId) {
			lecturers.push(this.lecturers.find(l => l.id === this.dropViewObjectId));
			c.lecturers = lecturers.filter(l => l.id !== this.dragViewObjectId);
			this.lecturersClasses.set(
				this.dragViewObjectId,
				this.lecturersClasses.get(this.dragViewObjectId).filter(cl => cl.id !== c.id));

			const classes = this.lecturersClasses.get(this.dropViewObjectId);
			classes.push(c);
			this.lecturersClasses.set(
				this.dropViewObjectId,
				classes);
		}

		const action = !c.id
			? this.classService.addClass(c)
			: c.lecturers.length > 0
				? this.classService.updateClass(c)
				: this.classService.deleteClass(c.id);

		action.subscribe();
		action.connect();


		this.view.viewClasses = this.lecturersClasses;

		this.updateAssosiated(c, c.lecturers);
		this.lecturersClasses = this.view.viewClasses;

		return lecturers;
	}

	updateAssosiated(c: models.Class, assosiated: models.EntityBase[]): void {
		// let groups = [];
		// let lecturers = [];

		// switch (this.view.context.toggle) {
		// 	case ViewToggle.GROUPS:
		// 		groups = assosiated;
		// 		lecturers = c.lecturers;
		// 		break;
		// 	case ViewToggle.LECTURERS:
		// 		groups = c.groups;
		// 		lecturers = assosiated;
		// 		break;
		// }

		// for (const assosiate of groups) {
		// 	this.groupsClasses.set(
		// 		assosiate.id,
		// 		this.groupsClasses.get(assosiate.id).map(cl => cl.id === c.id ? c : cl));
		// }

		// for (const assosiate of lecturers) {
		// 	this.lecturersClasses.set(
		// 		assosiate.id,
		// 		this.lecturersClasses.get(assosiate.id).map(cl => cl.id === c.id ? c : cl));
		// }
	}
}
