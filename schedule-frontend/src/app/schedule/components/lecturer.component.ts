import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { Class, Classroom, Group, User } from "../../common/models/models";

import {
	getCurrentYear, getCurrentSemester,
	getUserInitials,
	getClassStart, getClassEnd,
	getDayOfWeekNumber,
	getGroupsAsString, getClassroomsAsString
} from "../../common/models/functions";

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
	groups: string
}

@Component({
	selector: "schedule-lecturer",
	templateUrl: "./lecturer.component.html"
})
export class LecturerComponent implements OnInit {
	private route: ActivatedRoute;
	private router: Router;

	private classService: ClassService;
	private classroomService: ClassroomService;
	private groupService: GroupService;
	private userService: UserService;

	private currentLecturer: string;
	private classes: ClassInfo[] = [];

	isLoaded = false;

	constructor(
		route: ActivatedRoute,
		router: Router,
		classService: ClassService,
		classroomService: ClassroomService,
		groupService: GroupService,
		userService: UserService) {
		this.route = route;
		this.router = router;

		this.classService = classService;
		this.classroomService = classroomService;
		this.groupService = groupService;
		this.userService = userService;
	}

	ngOnInit(): void {
		const currentYear = getCurrentYear();
		const semester = getCurrentSemester();

		this.route.params
			.switchMap((params: Params) => this.userService.getUser(+params["id"]))
			.subscribe((lecturer: User) => {
				this.currentLecturer = getUserInitials(lecturer);

				this.classService.getClassesByLecturerAndYearAndSemester(
					lecturer.id, currentYear, semester)
					.subscribe((classes: Class[]) => this.initClasses(classes));
			});
	}

	private initClasses(classes: Class[]): void {
		let observables: Observable<any>[] = [];

		if (classes.length === 0) {
			this.isLoaded = true;
		} else {
			for (let c of classes) {
				observables.push(Observable.forkJoin([
						this.classroomService.getClassroomsByClass(c.id),
						this.groupService.getGroupsByClass(c.id)
					],
					(cr: Classroom[], g: Group[]): ClassInfo => {
						return {
							day: c.dayOfWeek,
							number: c.number,
							start: getClassStart(c.number),
							end: getClassEnd(c.number),
							frequency: c.frequency,
							subject: c.subject.name,
							type: c.type,
							classrooms: getClassroomsAsString(cr),
							groups: getGroupsAsString(g)
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
