import { Injectable } from "@angular/core";
import { ViewToggle } from "../components/helpers";
import { Observable } from "rxjs/Observable";
import * as models from "../../common/models/models";
import { ClassService, UserService, WishService, GroupService, ClassroomService } from "../../common/services/services";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {
    getCurrentYear,
    getCurrentSemester,
    compareUsersByName,
} from "../../common/models/functions";
import { ViewContext, LecturersContext, GroupsContext, ClassroomsContext } from "../models/models";

@Injectable()
export class ViewService {
    private lecturerWishes: Map<number, models.Wish[]> = new Map();

    currentClasses: Map<number, models.Class[]> = new Map();

    context: BehaviorSubject<ViewContext>;
    updatedViewClasses: BehaviorSubject<Map<number, models.Class[]>> = new BehaviorSubject(new Map());

    wishes: BehaviorSubject<Map<number, models.Wish[]>> = new BehaviorSubject(new Map());

    constructor(private classService: ClassService,
        private userService: UserService,
        private wishService: WishService,
        private groupService: GroupService,
        private classroomService: ClassroomService) {
            this.context = new BehaviorSubject<ViewContext>(new LecturersContext(this.userService, this.classService));
    }

    setView(toggle: ViewToggle, facultyId: number) {
        let context: ViewContext;
        switch (toggle) {
            case ViewToggle.LECTURERS:
                context = new LecturersContext(this.userService, this.classService);
                break;
            case ViewToggle.GROUPS:
                context = new GroupsContext(this.groupService, this.classService);
                break;
            case ViewToggle.CLASSROOMS:
                context = new ClassroomsContext(this.classroomService, this.classService);
        }

        context.getContextObjects(facultyId).subscribe(objects => {
            context.objects = context.sortContextObjects(objects);
            this.context.next(context);

            for (const obj of objects) {
                context.getContextClassesForObject(obj.id)
                .subscribe(classes => {
                    this.currentClasses.set(obj.id, classes);
                    this.updateViewClasses(this.currentClasses);
                });
            }
        });
    }

    updateViewClasses(updatedClasses: Map<number, models.Class[]>) {
        updatedClasses.forEach((objectClasses, objectId) => {
            this.currentClasses.set(objectId, objectClasses);
        });
        this.updatedViewClasses.next(updatedClasses);
    }

    updateLecturerWishes(wishes: Map<number, models.Wish[]>) {
        this.lecturerWishes = wishes;
        this.wishes.next(wishes);
    }

    private setLecturerWishes(lecturerId: number) {
        const lecturerWishes = this.lecturerWishes;
        this.wishService.getWishesByLecturerAndYearAndSemester(
            lecturerId,
            getCurrentYear(),
            getCurrentSemester())
            .subscribe((wishes: models.Wish[]) => {
                lecturerWishes.set(lecturerId, wishes);
                this.updateLecturerWishes(lecturerWishes);
            });
    }
}
