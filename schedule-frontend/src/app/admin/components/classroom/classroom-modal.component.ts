import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Classroom, ClassroomType } from "../../../common/models/models";
import { ClassroomService } from "../../../common/services/services";

@Component({
	selector: "schedule-admin-classroom-modal",
	templateUrl: "./classroom-modal.component.html"
})
export class ClassroomModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private classroomService: ClassroomService;

	classroom: Classroom = {
		building: null,
		number: null,
		type: null,
		capacity: 0
	};

	classroomTypes: ClassroomType[];

	isEditing = false;
	error = false;
	errorText = "";

	constructor(
		activeModal: NgbActiveModal,
		classroomService: ClassroomService) {
		this.activeModal = activeModal;
		this.classroomService = classroomService;
	}

	ngOnInit(): void {
		if (this.isEditing) {
			this.classroom.type = this.classroomTypes.find(
				t => t.id === this.classroom.type.id);
		}
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.classroom.type || this.classroom.capacity < 1 ||
			!this.classroom.number || this.classroom.number.length === 0) {
			this.error = true;
			this.errorText = "Заповніть усі поля.";
			return;
		}

		const action = this.isEditing
			? this.classroomService.updateClassroom(this.classroom)
			: this.classroomService.addClassroom(this.classroom);

		action.subscribe(
			() => this.activeModal.close(this.classroom),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}
