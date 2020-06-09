import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Faculty, Department } from "../../../common/models/models";
import { FacultyService, DepartmentService } from "../../../common/services/services";

@Component({
	// tslint:disable-next-line:component-selector
	selector: "schdedule-admin-department-modal",
	templateUrl: "./department-modal.component.html"
})
export class DepartmentModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private facultyService: FacultyService;
	private departmentService: DepartmentService;

	faculties: Faculty[] = [];

	department: Department = {
		name: null,
		faculty: null,
		groups: null
	};

	isEditing = false;
	error = false;
	errorText = "";

	constructor(activeModal: NgbActiveModal,
		facultyService: FacultyService,
		departmentService: DepartmentService) {
		this.activeModal = activeModal;
		this.facultyService = facultyService;
		this.departmentService = departmentService;
	}

	ngOnInit() {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) => {
				this.faculties = faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name));
				if (this.isEditing) {
					this.department.faculty = this.faculties.find(f =>
						f.id === this.department.faculty.id);
				}
			});
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.department.name || this.department.name.length === 0) {
			this.error = true;
			this.errorText = "Введіть назву спеціальності.";
			return;
		}

		if (!this.department.faculty) {
			this.error = true;
			this.errorText = "Виберіть факультет.";
			return;
		}

		const action = this.isEditing
			? this.departmentService.updateDepartment(this.department)
			: this.departmentService.addDepartment(this.department);

		action.subscribe(
			() => this.activeModal.close(this.department),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}
