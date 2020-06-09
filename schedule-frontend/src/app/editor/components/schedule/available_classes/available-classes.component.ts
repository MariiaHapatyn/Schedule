import { Component, OnInit, OnDestroy } from "@angular/core";
import { AvailableClassesService } from "../../../services/available-classes.service";
import { ThrowStmt } from "@angular/compiler";
import { Class } from "../../../../common/models/models";
import { getShortName, getGroupsAsString } from "../../../../common/models/functions";
import { ScheduleService } from "../../../services/schedule.service";
import { frequencyFromString } from "../../helpers";

@Component({
	selector: "schedule-editor-available-classes",
    templateUrl: "./available-classes.component.html"
})

export class AvailableClassesComponent implements OnInit {
    private availableClasses: Class[] = [];

    getShortName = getShortName;
    getGroupsAsString = getGroupsAsString;

    constructor(private availableClassesService: AvailableClassesService,
        private scheduleService: ScheduleService) {}

    ngOnInit() {
        this.availableClassesService.classes.subscribe(classes => {
            this.availableClasses = classes;
        });
    }

	startDrag(c: Class): void {
		this.scheduleService.startDrag(c, null, -1);
    }

	addDropItem(c: Class): void {
        this.scheduleService.addDropItem(c, null, -1, frequencyFromString(c.frequency));
	}

	releaseDrop(c: Class): void {
		this.scheduleService.releaseDrop(c);
	}
}
