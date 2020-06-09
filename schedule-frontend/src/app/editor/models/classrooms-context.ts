import { ViewContext } from "./models";
import { Class, Classroom } from "../../common/models/models";
import { getCurrentYear, getCurrentSemester, compareClassrooms } from "../../common/models/functions";
import { ViewToggle } from "../components/helpers";
import { ClassroomService, ClassService } from "../../common/services/services";
import { Observable } from "rxjs/Observable";
import { ClassModalComponent } from "../editor";

export class ClassroomsContext implements ViewContext {
    toggle = ViewToggle.CLASSROOMS;
    objects: Classroom[] = [];

    constructor(private classroomService: ClassroomService,
        private classService: ClassService) {}

    getContextObjects(facultyId: number): Observable<Classroom[]> {
        return this.classroomService.getClassrooms();
    }

    getContextClassesForObject(classroomId: number): Observable<Class[]> {
        return this.classService.getClassesByClassroomAndYearAndSemester(
            classroomId,
            getCurrentYear(),
            getCurrentSemester());
    }

    getClassContextObjects(c: Class): Classroom[] {
        return c.classrooms ? [...c.classrooms] : [];
    }

    setClassContextObject(c: Class, classrooms: Classroom[]): Class {
        return Object.assign({}, { ...c, classrooms: classrooms });
    }

    getSuitableObjects(c: Class): Classroom[] {
        return this.objects.filter(room => c.classroomType.id === 1 || room.type.id === c.classroomType.id);
    }

    getContextObjectName(classroom: Classroom): string {
        return `${classroom.number}, ${classroom.type.type}`;
    }

    sortContextObjects(classrooms: Classroom[]): Classroom[] {
        return classrooms.sort(compareClassrooms);
    }

    addClassContextObjectToView(c: Class, classroom: Classroom): Class {
        const current = c.classrooms;
        if (!current) {
            return this.setClassContextObject(c, [classroom]);
        } else {
            return this.setClassContextObject(c, [...current, classroom]);
        }
    }

    removeClassContextObjectFromView(c: Class, classroom: Classroom): Class {
        const current = c.classrooms;
        if (!current) {
            return c;
        } else {
            const updated = current.filter(l => l.id !== classroom.id);
            return this.setClassContextObject(c, updated.length > 0 ? updated : null);
        }
    }

    shouldAddToAvailableClassesOnDrop(c: Class): boolean {
        return !c.classrooms || c.classrooms.length === 0;
    }

    shouldAddToAvailableClassesOnUpdate(c: Class): boolean {
        return !c.classrooms || c.classrooms.length === 0;
    }

    setModalContext(modal: ClassModalComponent, classroom: Classroom): void {
        // modal.contextLecturer = classroom;
    }
}
