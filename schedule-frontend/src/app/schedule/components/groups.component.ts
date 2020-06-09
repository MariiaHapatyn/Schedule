import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
	getCurrentGroupCourse, getCurrentGroupName
} from "../../common/models/functions";

import { Faculty, Group } from "../../common/models/models";

import {
	GroupService, FacultyService
} from "../../common/services/services";

@Component({
	selector: "schedule-groups",
	templateUrl: "./groups.component.html"
})
export class GroupsComponent implements OnInit {
	private router: Router;
	private facultyService: FacultyService;
	private groupService: GroupService;

	faculties: Faculty[];
	groups: Map<number, Group[]>;

	getCurrentGroupName = getCurrentGroupName;

	constructor(
		router: Router,
		facultyService: FacultyService,
		groupService: GroupService) {
		this.router = router;
		this.facultyService = facultyService;
		this.groupService = groupService;
		this.groups = new Map();
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) => {
				faculties.sort((f1, f2) => f1.name.localeCompare(f2.name));
				this.faculties = faculties;

				for (const faculty of faculties) {
					this.groupService.getGroupsByFaculty(faculty.id)
						.subscribe((groups: Group[]) => {
							groups.sort((g1, g2) =>
								getCurrentGroupName(g1).localeCompare(getCurrentGroupName(g2)));
							this.groups.set(faculty.id, groups);
						});
				}
			});
	}

	getGroups(facultyId: number, course: number): Group[] {
		return this.groups.has(facultyId)
			? this.groups.get(facultyId)
				.filter(g => getCurrentGroupCourse(g) === course)
			: [];
	}

	navigateToGroup(groupId: number): void {
		this.router.navigate([ "/schedule/group", groupId ]);
	}
}
