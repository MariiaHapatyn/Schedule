import { ViewContext } from "./models";
import { Class, User } from "../../common/models/models";
import { getUserInitials, getCurrentYear, getCurrentSemester, compareUsersByName } from "../../common/models/functions";
import { ViewToggle } from "../components/helpers";
import { UserService, ClassService } from "../../common/services/services";
import { Observable } from "rxjs/Observable";
import { ClassModalComponent } from "../editor";

export class LecturersContext implements ViewContext {
    toggle = ViewToggle.LECTURERS;
    objects: User[] = [];

    constructor(private userService: UserService,
        private classService: ClassService) {}

    getContextObjects(facultyId: number): Observable<User[]> {
        return this.userService.getLecturersByFacultyIncludeRelated(facultyId);
    }

    getContextClassesForObject(lecturerId: number): Observable<Class[]> {
        return this.classService.getClassesByLecturerAndYearAndSemester(
            lecturerId,
            getCurrentYear(),
            getCurrentSemester());
    }

    getClassContextObjects(c: Class): User[] {
        return c.lecturers ? [...c.lecturers] : [];
    }

    setClassContextObject(c: Class, lecturers: User[]): Class {
        return Object.assign({}, { ...c, lecturers: lecturers });
    }

    getSuitableObjects(c: Class): User[] {
        return [...c.subject.lecturers];
    }

    getContextObjectName(lecturer: User): string {
        return getUserInitials(lecturer);
    }

    sortContextObjects(lecturers: User[]): User[] {
        return lecturers.sort(compareUsersByName);
    }

    addClassContextObjectToView(c: Class, lecturer: User): Class {
        const current = c.lecturers;
        if (!current) {
            return this.setClassContextObject(c, [lecturer]);
        } else {
            return this.setClassContextObject(c, [...current, lecturer]);
        }
    }

    removeClassContextObjectFromView(c: Class, lecturer: User): Class {
        const current = c.lecturers;
        if (!current) {
            return c;
        } else {
            const updated = current.filter(l => l.id !== lecturer.id);
            return this.setClassContextObject(c, updated.length > 0 ? updated : null);
        }
    }

    shouldAddToAvailableClassesOnDrop(c: Class): boolean {
        return !c.lecturers || c.lecturers.length === 0;
    }

    shouldAddToAvailableClassesOnUpdate(c: Class): boolean {
        return !c.lecturers || c.lecturers.length === 0;
    }

    setModalContext(modal: ClassModalComponent, lecturer: User): void {
        modal.contextLecturer = lecturer;
    }
}
