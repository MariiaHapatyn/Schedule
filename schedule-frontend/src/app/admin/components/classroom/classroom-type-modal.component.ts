import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassroomType } from "../../../common/models/models";
import { ClassroomTypeService } from "../../../common/services/services";

@Component({
	selector: "schedule-admin-classroom-type-modal",
	templateUrl: "./classroom-type-modal.component.html"
})
export class ClassroomTypeModalComponent {
	private activeModal: NgbActiveModal;

	private classroomTypeService: ClassroomTypeService;

	classroomType: ClassroomType = {
		type: null
	};

	isEditing = false;
	error = false;
	errorText = "";

	constructor(
		activeModal: NgbActiveModal,
		classroomTypeService: ClassroomTypeService) {
		this.activeModal = activeModal;
		this.classroomTypeService = classroomTypeService;
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.classroomType.type || this.classroomType.type.length === 0) {
			this.error = true;
			this.errorText = "Введіть тип.";
			return;
		}

		const action = this.isEditing
			? this.classroomTypeService.updateClassroomType(this.classroomType)
			: this.classroomTypeService.addClassroomType(this.classroomType);

		action.subscribe(
			() => this.activeModal.close(this.classroomType),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}
