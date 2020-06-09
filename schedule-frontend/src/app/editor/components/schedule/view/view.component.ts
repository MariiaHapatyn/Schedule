import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassModalComponent } from "../class-modal.component";

import * as models from "../../../../common/models/models";
import {
	getClassStart, getClassEnd,
	getDayOfWeekNumber,	getDayOfWeekName,
	getUsersAsString, getGroupsAsString, getClassroomsAsString
} from "../../../../common/models/functions";

import {
	ClassCell, ClassFrequency, ViewToggle,
	frequencyFromString, frequencyToString, isClassFull, getDay, getNumber, getArrayOfNumbers
} from "../../helpers";
import { DragAndDropService } from "../../../services/drag-and-drop.service";
import { ViewService } from "../../../services/view.service";
import { ScheduleService } from "../../../services/schedule.service";
import { MovingCell, ViewContext, LecturersContext, Cell } from "../../../models/models";
import { DayOfWeek } from "../../../../common/models/enums";
import { ClassModel } from "../../../models/class-model";

@Component({
	selector: "schedule-editor-view",
    templateUrl: "./view.component.html"
})

export class ViewComponent implements OnInit, OnDestroy {
    @ViewChild("scheduleTable")
    private table: ElementRef;

	private scrollLeft = false;
    private scrollRight = false;
    private fontSize = 1;

	showDenominator = false;

	context: ViewContext;

    // viewToggle = ViewToggle.LECTURERS;
	// viewObjects: any[] = [];
	viewClasses: Map<number, models.Class[]> = new Map();
    viewCells: Map<number, ClassCell[]> = new Map();

    wishes: Map<number, models.Wish[]> = new Map();

    areLoaded: Map<number, boolean> = new Map();

	getClassStart = getClassStart;
    getClassEnd = getClassEnd;
    getDay = getDay;
    getNumber = getNumber;
	getDayOfWeekName = getDayOfWeekName;
    getDayOfWeekNumber = getDayOfWeekNumber;
	getLecturersAsString = getUsersAsString;
	getGroupsAsString = getGroupsAsString;
    getClassroomsAsString = getClassroomsAsString;
    getArrayOfNumbers = getArrayOfNumbers;

    isClassFull = isClassFull;

	constructor(
		private modalService: NgbModal,
		private viewService: ViewService,
		private scheduleService: ScheduleService) {
		setInterval(() => {
			if (this.scrollRight) {
				this.table.nativeElement.scrollBy(10, 0);
			}

			if (this.scrollLeft) {
				this.table.nativeElement.scrollBy(-10, 0);
			}
		}, 100);
	}

	ngOnInit(): void {
		this.viewService.context.subscribe(context => {
			this.context = context;
			this.viewClasses = new Map();
			this.viewCells = new Map();
		});

		this.viewService.updatedViewClasses.subscribe(updatedClasses => {
			const viewClasses = this.viewClasses;
			const viewCells = this.viewCells;
			updatedClasses.forEach((classes, viewObjectId) => {
				viewClasses.set(viewObjectId, classes);
				viewCells.set(viewObjectId, this.getViewClasses(classes));
				this.areLoaded.set(viewObjectId, true);
			});

			this.viewCells = viewCells;
		});
		this.viewService.wishes.subscribe(wishes => this.wishes = wishes);
	}

	ngOnDestroy(): void {
		this.viewService.context.unsubscribe();
	}

	decreaseSize(): void {
		if (this.fontSize > 0.2) {
			this.fontSize -= 0.2;
		}
	}

	increaseSize(): void {
		if (this.fontSize < 2) {
			this.fontSize += 0.2;
		}
	}

	getClass(
		viewObjectId: number,
		day: string,
		num: number,
		frequency: string): models.Class | undefined {
		const classes = this.viewClasses.get(viewObjectId);

		return classes.find(
			c => c.dayOfWeek === day &&
				c.number === num &&
				c.frequency.toLowerCase() === frequency.toLowerCase());
	}

	getViewObjectName(obj: models.EntityBase): string {
		return this.context.getContextObjectName(obj);
	}

	getViewClasses(classes: models.Class[]): ClassCell[] | undefined {
		const result = getArrayOfNumbers(45).map(n => {
			const cell: ClassCell = new ClassCell();
			cell.n = n;
			cell.frequency = ClassFrequency.NONE;

			const day = getDay(n);
			const num = getNumber(n);
			if (classes && classes.length !== 0) {
				const filtered = classes.filter(
					c => getDayOfWeekNumber(c.dayOfWeek) === day &&
						c.number === num);
				if (filtered.length === 2) {
					cell.frequency = ClassFrequency.BIWEEKLY;
				} else if (filtered.length === 1) {
					cell.frequency = frequencyFromString(filtered[0].frequency);
				}

				cell.weekly = filtered.find(c => frequencyFromString(c.frequency) === ClassFrequency.WEEKLY);
				cell.numerator = filtered.find(c => frequencyFromString(c.frequency) === ClassFrequency.NUMERATOR);
				cell.denominator = filtered.find(c => frequencyFromString(c.frequency) === ClassFrequency.DENOMINATOR);
			}

			return cell;
		});

		return result;
    }

	canDrop(viewObjectId: number, dropPosition: number, dropFrequency: number): boolean {
		const dropCell = new MovingCell(viewObjectId, dropPosition, dropFrequency);

		return this.scheduleService.canDrop(dropCell);
    }

	isSuitable(lecturer: models.User, n: number): string {
		if (this.context.toggle !== ViewToggle.LECTURERS) {
			return "";
		}

        const wish = this.getWish(lecturer.id, this.getDay(n), this.getNumber(n));

		return !wish
			? ""
			: `suitable-${wish.suitable}`;
	}

	getCellClass(position: number) {
		return getNumber(position) === 9 ? "right-border" : "";
	}

	getCellAvailableClass(viewObjectId: number, position: number, frequency: number): string {
		return `available-${this.canDrop(viewObjectId, position, frequency)}`;
	}

	getWish(lecturerId: number, day: number, classNum: number): models.Wish {
		let wish: models.Wish = null;
		const wishes = this.wishes.get(lecturerId);
		if (wishes != null) {
			wish = wishes.find(w => {
				return getDayOfWeekNumber(w.dayOfWeek) === day
					&& w.startTime.localeCompare(getClassStart(classNum) + ":00") <= 0
					&& w.endTime.localeCompare(getClassEnd(classNum) + ":00") >= 0;
			});
		}
		return wish;
	}

	editClassClicked(
		classObject: models.Class,
		viewObject: models.EntityBase): void {
		this.openModal(viewObject, classObject, true);
	}

	addClassClicked(
		frequency: ClassFrequency,
		day: number,
		num: number,
		viewObject: models.EntityBase,
		wish: models.Wish): void {
			const contextObjects = [viewObject];
			const originalClass = this.context.setClassContextObject(new ClassModel(), contextObjects);
			originalClass.dayOfWeek = getDayOfWeekName(day);
			originalClass.number = num;
			originalClass.frequency = frequency === ClassFrequency.NONE
				? frequencyToString(ClassFrequency.WEEKLY)
				: frequencyToString(frequency);

			this.openModal(viewObject, originalClass, false);
    }

	openModal(
		viewObject: models.EntityBase,
		originalClass: models.Class,
		isEditing: boolean) {
		const modalRef = this.modalService.open(ClassModalComponent, { size: "lg" });
		const modal = modalRef.componentInstance as ClassModalComponent;
		const frequency = frequencyFromString(originalClass.frequency);
		const reverseFrequencyName = frequencyToString(
			frequency === ClassFrequency.NUMERATOR
				? ClassFrequency.DENOMINATOR
				: ClassFrequency.NUMERATOR);

		this.context.setModalContext(modal, viewObject);
		modal.frequencySet = frequency !== ClassFrequency.WEEKLY &&
			this.getClass(viewObject.id, originalClass.dayOfWeek, originalClass.number, reverseFrequencyName) as any;
		modal.currentClass = { ...originalClass };
		modal.isEditing = isEditing;

		modalRef.result.then(
			result => {
				this.scheduleService.closeClassModal(result.action, originalClass, result.changedClass);
			},
			() => {});
	}

	startDrag(c: models.Class, viewObjectId: number, position: number): void {
		this.scheduleService.startDrag(c, viewObjectId, position);
		this.showDenominator = frequencyFromString(c.frequency) !== ClassFrequency.WEEKLY;
    }

	addDropItem(c: models.Class, viewObjectId: number, position: number, frequency: number): void {
        this.scheduleService.addDropItem(c, viewObjectId, position, frequency);
	}

	releaseDrop(c: models.Class): void {
		this.scheduleService.releaseDrop(c);
        this.showDenominator = false;
	}
}
