import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { compareUsersByName } from "../../common/models/functions";

import { Faculty, User } from "../../common/models/models";

import {
	UserService, FacultyService
} from "../../common/services/services";

@Component({
	selector: "schedule-lecturers",
	templateUrl: "./lecturers.component.html"
})
export class LecturersComponent implements OnInit {
	private router: Router;
	private facultyService: FacultyService;
	private userService: UserService;

	faculties: Faculty[];
	lecturers: Map<number, User[]>;

	constructor(
		router: Router,
		facultyService: FacultyService,
		userService: UserService) {
		this.router = router;
		this.facultyService = facultyService;
		this.userService = userService;
		this.lecturers = new Map();
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) => {
				faculties.sort((f1, f2) => f1.name.localeCompare(f2.name));
				this.faculties = faculties;

				for (let faculty of faculties) {
					this.userService.getLecturersByFaculty(faculty.id)
						.subscribe((lecturers: User[]) => {
							lecturers.sort(compareUsersByName);
							this.lecturers.set(faculty.id, lecturers);
						});
				}
			});
	}

	navigateToLecturer(lecturerId: number): void {
		this.router.navigate([ "/schedule/lecturer", lecturerId ]);
	}
}

