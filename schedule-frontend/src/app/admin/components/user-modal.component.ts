import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { getAuthorityName, getDepartmentsAsString } from "../../common/models/functions";
import { Authority, Faculty, User, Department } from "../../common/models/models";
import { FacultyService, UserService, DepartmentService } from "../../common/services/services";

@Component({
	selector: "schedule-admin-user-modal",
	templateUrl: "./user-modal.component.html"
})
export class UserModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private facultyService: FacultyService;
	private departmentService: DepartmentService;
	private userService: UserService;

	getAuthorityName = getAuthorityName;
	getDepartmentsAsString = getDepartmentsAsString;

	user: User = {
		username: null,
		firstName: null,
		middleName: null,
		lastName: null,
		position: null,
		password: "pass",
		department: null,
		authorities: [],
		relatedDepartments: []
	};

	authorities: Authority[] = [];
	faculties: Faculty[] = [];
	departments: Department[] = [];

	facultyDepartments: {
		faculty: Faculty;
		departments: Department[];
	}[] = [];

	currentFaculty: Faculty;

	isEditing = false;
	error = false;
	errorText: string = null;

	constructor(
		activeModal: NgbActiveModal,
		facultyService: FacultyService,
		departmentService: DepartmentService,
		userService: UserService) {
		this.activeModal = activeModal;
		this.facultyService = facultyService;
		this.departmentService = departmentService;
		this.userService = userService;
	}

	ngOnInit(): void {
		if (this.isEditing) {
			this.currentFaculty = this.faculties.find(f => f.id === this.user.department.faculty.id);

			this.setDepartments();
			this.setFacultyDepartments();
			this.setRelatedDepartments();
		}
	}

	setDepartments(): void {
		this.departments = [];

		if (!this.currentFaculty) {
			return;
		}

		this.departmentService.getDepartmentsByFaculty(this.currentFaculty.id)
			.subscribe((departments: Department[]) => {
				this.departments = departments;
				this.user.department = this.departments.find(d => d.id === this.user.department.id);
			});
	}

	setRelatedDepartments(): void {
		this.departmentService.getDepartmentsByRelatedLecturer(
			this.user.id
		).subscribe(departments => this.user.relatedDepartments = departments);
	}

	setFacultyDepartments(): void {
		this.facultyDepartments = [];

		for (const faculty of this.faculties) {
			this.departmentService.getDepartmentsByFaculty(
				faculty.id)
				.subscribe((departments: Department[]) =>
					this.facultyDepartments.push({
						faculty: faculty,
						departments: departments
							.sort((d1, d2) => d1.name.localeCompare(d2.name))
					}));
		}
	}

	departmentChecked(department: Department): void {
		if (this.user.relatedDepartments.includes(department)) {
			this.user.relatedDepartments = this.user.relatedDepartments.filter(
				d => d.id !== department.id);
		} else {
			this.user.relatedDepartments.push(department);
		}
	}

	isDepartmentChecked(department: Department): boolean {
		return !this.user.relatedDepartments ||
			this.user.relatedDepartments.find(d => d.id === department.id) as any;
	}


	isAuthorityChecked(authority: Authority): boolean {
		return !!this.user.authorities.find(a => a.id === authority.id);
	}

	authorityChecked(authority: Authority) {
		if (!!this.user.authorities.find(a => a.id === authority.id)) {
			this.user.authorities = this.user.authorities.filter(
				a => a.id !== authority.id);
		} else {
			this.user.authorities.push(authority);
		}
	}

	change(): void {
		this.error = false;
		this.errorText = null;
	}

	submit(): void {
		if (!this.isUserValid()) {
			this.error = true;
			this.errorText = "Дані неправильно заповнені.";
		}

		const action = this.isEditing
			? this.userService.updateUser(this.user)
			: this.userService.addUser(this.user);

		action.subscribe(
			() => this.activeModal.close(this.user),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти";
			});

		action.connect();
	}

	isUserValid(): boolean {
		return this.user.username && this.user.username.length !== 0 &&
			this.user.authorities.length !== 0 &&
			this.user.firstName && this.user.firstName.length !== 0 &&
			this.user.middleName && this.user.middleName.length !== 0 &&
			this.user.lastName && this.user.lastName.length !== 0 &&
			this.user.position && this.user.position.length !== 0 &&
			this.user.department !== null;
	}
}
