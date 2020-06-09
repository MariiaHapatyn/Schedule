import { Injectable } from "@angular/core";
import { ViewToggle,
    getDay, getNumber,
    frequencyFromString, ClassFrequency, frequencyToString } from "../components/helpers";
import * as models from "../../common/models/models";
import { ClassService } from "../../common/services/services";
import {
    getDayOfWeekNumber,
    getDayOfWeekName
} from "../../common/models/functions";
import { ViewService } from "./view.service";
import { DragAndDropService } from "./drag-and-drop.service";
import { Cell, MovingCell, ViewContext, Action } from "../models/models";
import { AvailableClassesService } from "./available-classes.service";
import { Observable } from "rxjs/Observable";
import { CheckResult } from "../models/check-result";
import { AnalyzerService } from "./analyser.service";

@Injectable()
export class ScheduleService {
    private facultyId: number;

    viewContext: ViewContext;
    viewClasses: models.Class[];

    constructor(
        private classService: ClassService,
        private viewService: ViewService,
        private dragAndDropService: DragAndDropService,
        private availableClassesService: AvailableClassesService,
        private analyzerService: AnalyzerService) {
        this.viewService.context.subscribe(viewContext => {
            this.viewContext = viewContext;
        });
        this.viewService.updatedViewClasses.subscribe(() => {
            this.viewClasses = this.getAggregatedClasses();
        });
    }

    private getAggregatedClasses(): models.Class[] {
        let viewClasses = [];
        if (!this.viewClasses as any) {
            return viewClasses;
        }

        for (const obj of this.viewContext.objects) {
            const objectClasses = this.viewService.currentClasses.get(obj.id);
            if (objectClasses as any && objectClasses.length > 0) {
                viewClasses = viewClasses.concat(objectClasses.filter(c => !viewClasses.includes(c)));
            }
        }

        return viewClasses;
    }

    getCheckResult(): Observable<CheckResult> {
        return this.analyzerService.checkSchedule(this.facultyId);
    }

    setFaculty(facultyId: number): void {
        this.facultyId = facultyId;
    }

    setView(toggle: ViewToggle) {
        this.viewService.setView(toggle, this.facultyId);
        this.availableClassesService.setAvailableClasses(toggle, this.facultyId);
    }

    canDrop(dropCell: MovingCell): boolean {
        const dragClass = this.dragAndDropService.dragClass;

        if (!dragClass) {
            return true;
        }

        const checkCell = new Cell(dropCell);

        return this.isViewObjectSuitable(dropCell.viewObjectId, dragClass) &&
            this.areClassLecturersAvailable(dragClass, checkCell) &&
            this.areClassGroupsAvailable(dragClass, checkCell) &&
            this.areClassRoomsAvailable(dragClass, checkCell);
    }

    isViewObjectSuitable(objectId: number, dragClass: models.Class): boolean {
        const viewObjects = this.viewContext.getSuitableObjects(dragClass);

        return viewObjects.some(obj => obj.id === objectId);
    }

    isClassAffixed(c: models.Class, checkCell: Cell): boolean {
        return getDayOfWeekNumber(c.dayOfWeek) === checkCell.day &&
            c.number === checkCell.number &&
            (frequencyFromString(c.frequency) === ClassFrequency.WEEKLY ||
                frequencyFromString(c.frequency) === checkCell.frequency);
    }

    areClassLecturersAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const lecturers = dragClass.lecturers;

        return !lecturers || !lecturers.some(lecturer => !this.isLecturerAvailable(lecturer, checkCell));
    }

    isLecturerAvailable(lecturer: models.User, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.lecturers.some(l => l.id === lecturer.id) && this.isClassAffixed(c, checkCell));
    }

    areClassGroupsAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const groups = dragClass.groups;

        return !groups || !groups.some(group => !this.isGroupAvailable(group, checkCell));
    }

    isGroupAvailable(group: models.Group, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.groups.some(g => g.id === group.id) && this.isClassAffixed(c, checkCell));
    }

    areClassRoomsAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const classroorms = dragClass.classrooms;

        return !classroorms || !classroorms.some(classroorm => !this.isRoomAvailable(classroorm, checkCell));
    }

    isRoomAvailable(classroorm: models.Classroom, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.classrooms.some(room => room.id === classroorm.id) && this.isClassAffixed(c, checkCell));
    }

    startDrag(c: models.Class, viewObjectId: number, position: number): void {
        this.dragAndDropService.startDrag(c, viewObjectId, position);
    }

    addDropItem(c: models.Class, viewObjectId: number, position: number, frequency: number): void {
        this.dragAndDropService.addDropItem(c, viewObjectId, position, frequency);
    }

    releaseDrop(c: models.Class): void {
        const dropCell = this.dragAndDropService.getDropCell();
        const dragCell = this.dragAndDropService.getDragCell();

        if (dropCell.position !== -1 && !this.canDrop(dropCell)) {
            this.dragAndDropService.releaseDrop();
            return;
        }

        const movedClass = Object.assign({}, {
            ...c,
            dayOfWeek: getDayOfWeekName(getDay(dropCell.position)),
            number: getNumber(dropCell.position),
            frequency: frequencyToString(dropCell.frequency),
        });

        if (this.dragAndDropService.addToView()) {
            this.addToView(c, movedClass, dropCell);
        } else if (this.dragAndDropService.removeFromView()) {
            this.removeFromView(c, dragCell);
        } else if (this.dragAndDropService.changeViewObject()) {
            this.moveThroughViewObjects(movedClass, dragCell, dropCell);
        } else {
            this.moveOnView(movedClass);
        }

        this.dragAndDropService.releaseDrop();
    }

    closeClassModal(
        action: Action,
        originalClass: models.Class,
        changedClass: models.Class) {
        let addFor = [];
        let removeFor = [];
        let updateFor = [];
        let updateAvailable = this.availableClassesService.classes.value;
        const originalObjects = this.viewContext.getClassContextObjects(originalClass);
        const changedObjects = this.viewContext.getClassContextObjects(changedClass);
        switch (action) {
            case Action.CREATE:
                addFor = originalObjects;
                const groupIds = changedClass.groups.map(g => g.id);
                updateAvailable = updateAvailable.filter(c => {
                    return !(c.subject.id === changedClass.subject.id &&
                    c.type === changedClass.type &&
                    c.groups.length === groupIds.length &&
                    !c.groups.some(g => !groupIds.includes(g.id)));
                });
                break;
            case Action.UPDATE:
                addFor = changedObjects.filter(obj => !originalObjects.some(x => x.id === obj.id));
                removeFor = originalObjects.filter(obj => !changedObjects.some(x => x.id === obj.id));
                updateFor = changedObjects.filter(obj => originalObjects.some(x => x.id === obj.id));
                updateAvailable = updateAvailable.filter(c => {
                    return !(c.subject.id === changedClass.subject.id &&
                    c.type === changedClass.type &&
                    c.groups.length === groupIds.length &&
                    !c.groups.some(g => !groupIds.includes(g.id)));
                });
                if (this.viewContext.shouldAddToAvailableClassesOnUpdate(changedClass)) {
                    updateAvailable = [...updateAvailable, changedClass];
                }
                break;
            case Action.DELETE:
                removeFor = changedObjects;
                if (this.viewContext.shouldAddToAvailableClassesOnUpdate(changedClass)) {
                    updateAvailable = [...updateAvailable, changedClass];
                }
                break;
        }

        const updatedClasses = this.changeViewObject(changedClass, addFor, removeFor, updateFor);
        this.updateView(updatedClasses, updateAvailable);
    }

    private addToView(
        dragClass: models.Class,
        movedClass: models.Class,
        dropCell: MovingCell) {
        const dropViewObject = this.viewContext.objects.find(obj => obj.id === dropCell.viewObjectId);
        const updated = this.viewContext.addClassContextObjectToView(movedClass, dropViewObject);

        const action = this.classService.addClass(updated);
        action.subscribe(() => {
            const updatedClasses = this.changeViewObject(updated, [dropViewObject], [], []);
            const updateAvailableClasses = this.availableClassesService.classes.value
                .filter(cl => cl !== dragClass);

                this.updateView(updatedClasses, updateAvailableClasses);
            });
            action.connect();
    }

    private removeFromView(
        dragClass: models.Class,
        dragCell: MovingCell) {
        const dragViewObject = this.viewContext.objects.find(obj => obj.id === dragCell.viewObjectId);
        const updated = this.viewContext.removeClassContextObjectFromView(dragClass, dragViewObject);
        const updateAvailableClasses = this.availableClassesService.classes.value;
        const updatedClasses = this.changeViewObject(updated, [], [dragViewObject], []);

        if (this.viewContext.shouldAddToAvailableClassesOnDrop(updated)) {
            const action = this.classService.deleteClass(updated.id);
            action.subscribe(() => {
                this.updateView(updatedClasses, [...updateAvailableClasses, updated]);
            });
            action.connect();
        } else {
            const action = this.classService.updateClass(updated);
            action.subscribe(() => {
                this.updateView(updatedClasses, updateAvailableClasses);
            });
            action.connect();
        }
    }

    private moveThroughViewObjects(
        movedClass: models.Class,
        dragCell: MovingCell,
        dropCell: MovingCell) {
        const dropViewObject = this.viewContext.objects.find(obj => obj.id === dropCell.viewObjectId);
        const dragViewObject = this.viewContext.objects.find(obj => obj.id === dragCell.viewObjectId);

        const addFor: models.EntityBase[] = [dropViewObject];
        const removeFor: models.EntityBase[] = [dragViewObject];
        const updateFor: models.EntityBase[] = [
            ...this.viewContext.getClassContextObjects(movedClass).filter(obj => obj.id !== dragViewObject.id)
        ];
        const updated = this.viewContext.setClassContextObject(movedClass, [...updateFor, ...addFor]);

        const updatedClasses = this.changeViewObject(updated, addFor, removeFor, updateFor);
        const updateAvailableClasses = this.availableClassesService.classes.value;

        const action = this.classService.updateClass(updated);
        action.subscribe(() => {
            this.updateView(updatedClasses, updateAvailableClasses);
        });
        action.connect();
    }

    private moveOnView(movedClass: models.Class) {
        const action = this.classService.updateClass(movedClass);
        const updatedClasses = this.changePosition(movedClass);
        const updateAvailableClasses = this.availableClassesService.classes.value;
        action.subscribe(() => {
            this.updateView(updatedClasses, updateAvailableClasses);
        });
        action.connect();
    }

    private changeViewObject(
        movedClass: models.Class,
        addFor: models.EntityBase[],
        removeFor: models.EntityBase[],
        updateFor: models.EntityBase[]): Map<number, models.Class[]> {
        const updatedClasses = new Map<number, models.Class[]>();
        const currentClasses = this.viewService.currentClasses;

        for (const obj of addFor) {
            let classes = currentClasses.get(obj.id);
            classes = !classes
            ? [movedClass]
            : [...classes, movedClass];

            updatedClasses.set(obj.id, classes);
        }

        for (const obj of updateFor) {
            let classes = currentClasses.get(obj.id);
            classes = !classes
                ? []
                : classes.map(c => c.id === movedClass.id ? movedClass : c);

            updatedClasses.set(obj.id, classes);
        }

        for (const obj of removeFor) {
            let classes = currentClasses.get(obj.id);
            classes = !classes
            ? []
            : classes.filter(c => c.id !== movedClass.id);

            updatedClasses.set(obj.id, classes);
        }

        return updatedClasses;
    }

    private changePosition(
        movedClass: models.Class): Map<number, models.Class[]> {
        const updateClassesFor = this.viewContext.getClassContextObjects(movedClass);

        const updatedClasses = new Map<number, models.Class[]>();
        const currentClasses = this.viewService.currentClasses;

        for (const obj of updateClassesFor) {
            const classes = currentClasses.get(obj.id).map(c => c.id === movedClass.id ? movedClass : c);
            updatedClasses.set(obj.id, classes);
        }

        return updatedClasses;
    }

    private updateView(viewClasses: Map<number, models.Class[]>, availableClasses: models.Class[]) {
        this.viewService.updateViewClasses(viewClasses);
        this.availableClassesService.updateAvailableClasses(availableClasses);
    }
}
