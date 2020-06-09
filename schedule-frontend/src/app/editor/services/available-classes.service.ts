import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Class } from "../../common/models/models";
import { ClassService } from "../../common/services/services";
import { getCurrentYear, getCurrentSemester, compareClassesByShortName } from "../../common/models/functions";
import { ViewToggle } from "../components/helpers";

@Injectable()
export class AvailableClassesService {
    classes: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);

    constructor(private classService: ClassService) {
    }

    setAvailableClasses(toggle: ViewToggle, facultyId: number): void {
        this.classService.getGeneratedClassesByContextAndFacultyAndYearAndSemester(
            toggle,
            facultyId,
            getCurrentYear(),
            getCurrentSemester()
        ).subscribe((classes: Class[]) => {
            this.updateAvailableClasses(classes.sort(compareClassesByShortName));
        });
    }

    updateAvailableClasses(classes: Class[]): void {
        this.classes.next(classes.sort(compareClassesByShortName));
    }
}
