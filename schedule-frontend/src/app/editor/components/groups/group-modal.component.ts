import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Group, Department } from "../../../common/models/models";
import { GroupService, DepartmentService } from "../../../common/services/services";

@Component({
	selector: "schedule-editor-group-modal",
	templateUrl: "./group-modal.component.html"
})
export class GroupModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private groupService: GroupService;
	private departmentService: DepartmentService;

	facultyId: number;
	departments: Department[];

	group: Group = {
		name: null,
		numStudents: 0,
		year: 0,
		department: null
	};

	isEditing = false;
	error = false;
	errorText = "";

	constructor(activeModal: NgbActiveModal,
		departmentService: DepartmentService,
		groupService: GroupService) {
		this.activeModal = activeModal;
		this.departmentService = departmentService;
		this.groupService = groupService;
	}

	ngOnInit() {
		this.departmentService.getDepartmentsByFaculty(this.facultyId)
			.subscribe(departments => {
				this.departments = departments;

				if (this.isEditing) {
					this.group.department = this.departments.find(d =>
						d.id === this.group.department.id);
				}
			});
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.group.name || this.group.name.length === 0) {
			this.error = true;
			this.errorText = "Заповніть усі поля.";
			return;
		}

		if (this.group.numStudents < 0) {
			this.error = true;
			this.errorText = "Кількість студентів має бути невід'ємною.";
			return;
		}

		const action = this.isEditing
			? this.groupService.updateGroup(this.group)
			: this.groupService.addGroup(this.group);

		action.subscribe(
			() => this.activeModal.close(this.group),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}
