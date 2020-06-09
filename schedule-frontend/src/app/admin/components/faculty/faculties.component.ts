import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


import { Faculty, Department } from "../../../common/models/models";
import { FacultyService, DepartmentService } from "../../../common/services/services";

import { DepartmentModalComponent } from "./department-modal.component";
import { FacultyModalComponent } from "./faculty-modal.component";

@Component({
	selector: "schedule-admin-faculties",
	templateUrl: "./faculties.component.html"
})
export class FacultiesComponent implements OnInit {
	private modalService: NgbModal;

	private facultyService: FacultyService;
	private departmentService: DepartmentService;

	faculties: Faculty[] = [];
	departments: Map<number, Department[]> = new Map();

	constructor(
		modalService: NgbModal,
		departmentService: DepartmentService,
		facultyService: FacultyService) {

		this.modalService = modalService;

		this.facultyService = facultyService;
		this.departmentService = departmentService;
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) => {
				this.faculties = faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name));

				const departmentsMap = new Map();
				for (const faculty of faculties) {
					this.departmentService.getDepartmentsByFaculty(faculty.id)
						.subscribe((departments: Department[]) => {
							departmentsMap.set(faculty.id, departments);

							this.departments = departmentsMap;
						});
				}
			});
	}

	addDepartmentClicked(): void {
		const modalRef = this.modalService.open(DepartmentModalComponent);
		const departmentsMap = this.departments;

		modalRef.result.then(
			(department: Department) => {
				departmentsMap.set(
					department.faculty.id,
					[...departmentsMap.get(department.faculty.id), department]
						.sort((d1, d2) => d1.name.localeCompare(d2.name)));

				this.departments = departmentsMap;
			},
			() => { });
	}

	editDepartmentClicked(department: Department): void {
		const modalRef = this.modalService.open(DepartmentModalComponent);
		const modal = modalRef.componentInstance as DepartmentModalComponent;

		modal.isEditing = true;
		modal.department = {
			id: department.id,
			name: department.name,
			faculty: department.faculty,
			groups: department.groups
		};

		modalRef.result.then(
			(updatedDepartment: Department) => {
				department.name = updatedDepartment.name;
				const facultyId = department.faculty.id;
				const updatedFacultyId = updatedDepartment.faculty.id;
				if (facultyId !== updatedFacultyId) {
					department.faculty = updatedDepartment.faculty;
					const departmentsMap = this.departments;
					departmentsMap.set(facultyId, departmentsMap.get(facultyId).filter(d => d.id !== department.id));
					departmentsMap.set(updatedFacultyId, [...departmentsMap.get(updatedFacultyId), department]);
				}
			},
			() => { });
	}

	deleteDepartmentClicked(id: number): void {
		const action = this.departmentService.deleteDepartment(id);

		action.subscribe(
			() => this.faculties = this.faculties.filter(f => f.id !== id),
			() => { });

		action.connect();
	}

	addFacultyClicked(): void {
		const modalRef = this.modalService.open(FacultyModalComponent);

		modalRef.result.then(
			(faculty: Faculty) => {
				this.faculties.push(faculty);
				this.faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name));
			},
			() => { });
	}

	editFacultyClicked(faculty: Faculty): void {
		const modalRef = this.modalService.open(FacultyModalComponent);
		const modal = modalRef.componentInstance as FacultyModalComponent;

		modal.isEditing = true;
		modal.faculty = {
			id: faculty.id,
			name: faculty.name
		};

		modalRef.result.then(
			(updatedFaculty: Faculty) => faculty.name = updatedFaculty.name,
			() => { });
	}

	deleteFacultyClicked(id: number): void {
		const action = this.facultyService.deleteFaculty(id);
		action.subscribe(
			() => this.faculties = this.faculties.filter(f => f.id !== id),
			() => { });

		action.connect();
	}
}
