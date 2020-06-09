import { ViewContext } from "./models";
import { Class, Group } from "../../common/models/models";
import { getCurrentGroupName, getCurrentYear, getCurrentSemester } from "../../common/models/functions";
import { ViewToggle } from "../components/helpers";
import { GroupService, ClassService } from "../../common/services/services";
import { Observable } from "rxjs/Observable";
import { ClassModalComponent } from "../editor";

export class GroupsContext implements ViewContext {
    toggle = ViewToggle.GROUPS;
    objects: Group[] = [];

    constructor(private groupService: GroupService,
        private classService: ClassService) {}

    getContextObjects(facultyId: number): Observable<Group[]> {
        return this.groupService.getGroupsByFaculty(facultyId);
    }

    getContextClassesForObject(groupId: number): Observable<Class[]> {
        return this.classService.getClassesByGroupAndYearAndSemester(
            groupId,
            getCurrentYear(),
            getCurrentSemester());
    }

    getClassContextObjects(c: Class): Group[] {
        return c.groups ? [...c.groups] : [];
    }

    setClassContextObject(c: Class, groups: Group[]): Class {
        return Object.assign({}, { ...c, groups: groups });
    }

    getSuitableObjects(c: Class): Group[] {
        return c.groups ? [...c.groups] : [];
    }

    getContextObjectName(group: Group): string {
        return getCurrentGroupName(group);
    }

    sortContextObjects(groups: Group[]): Group[] {
        return groups;
    }

    addClassContextObjectToView(c: Class, group: Group): Class {
        const current = c.groups;
        if (!current) {
            return this.setClassContextObject(c, [group]);
        } else if (!current.includes(group)) {
            return this.setClassContextObject(c, [...current, group]);
        } else {
            return c;
        }
    }

    removeClassContextObjectFromView(c: Class, group: Group): Class {
        return c;
    }

    shouldAddToAvailableClassesOnDrop(c: Class): boolean {
        return false;
    }

    shouldAddToAvailableClassesOnUpdate(c: Class): boolean {
        return !c.groups || c.groups.length === 0;
    }

    setModalContext(modal: ClassModalComponent, group: Group): void {
        modal.contextGroup = group;
    }
}
