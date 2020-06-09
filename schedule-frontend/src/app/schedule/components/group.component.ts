import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

import {
	getCurrentYear, getCurrentSemester,
	getCurrentGroupName,
	getClassStart, getClassEnd,
	getDayOfWeekNumber,
	getUsersAsString, getClassroomsAsString
} from "../../common/models/functions";

import { Class, Classroom, Group, User } from "../../common/models/models";

import {
	ClassService, ClassroomService, GroupService, UserService
} from "../../common/services/services";

interface ClassInfo {
	day: string;
	number: number;
	start: string;
	end: string;
	frequency: string;
	subject: string;
	type: string;
	classrooms: string;
	lecturers: string;
}

@Component({
	selector: "schedule-group",
	templateUrl: "./group.component.html"
})
export class GroupComponent implements OnInit {
	private route: ActivatedRoute;
	private router: Router;

	private classService: ClassService;
	private classroomService: ClassroomService;
	private groupService: GroupService;
	private lecturerService: UserService;

	private currentGroup: string;
	private classes: ClassInfo[] = [];

	isLoaded = false;

	constructor(
		route: ActivatedRoute,
		router: Router,
		classService: ClassService,
		classroomService: ClassroomService,
		groupService: GroupService,
		lecturerService: UserService) {
		this.route = route;
		this.router = router;

		this.classService = classService;
		this.classroomService = classroomService;
		this.groupService = groupService;
		this.lecturerService = lecturerService;
	}

	ngOnInit(): void {
		const currentYear = getCurrentYear();
		const semester = getCurrentSemester();

		this.route.params
			.switchMap((params: Params) => this.groupService.getGroup(+params["id"]))
			.subscribe((group: Group) => {
				this.currentGroup = getCurrentGroupName(group);

				this.classService.getClassesByGroupAndYearAndSemester(
					group.id, currentYear, semester)
					.subscribe((classes: Class[]) => this.initClasses(classes));
			});
	}

	private initClasses(classes: Class[]): void {
		const observables: Observable<any>[] = [];

		if (classes.length === 0) {
			this.isLoaded = true;
		} else {
			for (const c of classes) {
				observables.push(Observable.forkJoin([
						this.classroomService.getClassroomsByClass(c.id),
						this.lecturerService.getLecturersByClass(c.id)
					],
					(classrooms: Classroom[], lecturers: User[]): ClassInfo => {
						return {
							day: c.dayOfWeek,
							number: c.number,
							start: getClassStart(c.number),
							end: getClassEnd(c.number),
							frequency: c.frequency,
							subject: c.subject.name,
							type: c.type,
							classrooms: getClassroomsAsString(classrooms),
							lecturers: getUsersAsString(lecturers)
						};
					}));
			}

			Observable.forkJoin(
				observables,
				(...args: ClassInfo[]): ClassInfo[] => args)
				.subscribe((tempClasses: ClassInfo[]) => {
					tempClasses.sort(
						(c1: ClassInfo, c2: ClassInfo) => {
							const day1 = getDayOfWeekNumber(c1.day);
							const day2 = getDayOfWeekNumber(c2.day);

							let result = day1 > day2
								? 1
								: day1 < day2 ? -1 : 0;

							if (result === 0) {
								result = c1.number > c2.number
									? 1
									: c1.number < c2.number ? -1 : 0;

								if (result === 0) {
									result = c1.frequency === "По чисельнику"
										? -1
										: 1;
								}
							}

							return result;
						});

					this.classes = tempClasses;
					this.isLoaded = true;
				});
		}
	}
}
