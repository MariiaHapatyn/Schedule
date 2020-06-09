import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
    getUserInitials, getUsersAsString
} from "../../../common/models/functions";

import { Subject } from "../../../common/models/models";

import { SubjectService } from "../../../common/services/services";

import { SubjectModalComponent } from "./subject-modal.component";

@Component({
	selector: "schedule-admin-subjects",
	templateUrl: "./subjects.component.html"
})
export class SubjectsComponent implements OnInit {
	private modalService: NgbModal;

    private subjectService: SubjectService;

	subjects: Subject[];

	getUserInitials = getUserInitials;
	getUsersAsString = getUsersAsString;

	constructor(
		modalService: NgbModal,
		subjectService: SubjectService) {
        this.modalService = modalService;
		this.subjectService = subjectService;
	}

	ngOnInit(): void {
		this.subjectService.getSubjects()
			.subscribe((subjects: Subject[]) =>
				this.subjects = subjects.sort(
					(s1, s2) => s1.name.localeCompare(s2.name)));
	}

	addSubjectClicked(): void {
		const modalRef = this.modalService.open(SubjectModalComponent);

		modalRef.result.then(
			(subject: Subject) => {
				this.subjects.push(subject);
				this.subjects.sort(
					(s1, s2) => s1.name.localeCompare(s2.name));
			},
			() => { });
	}

	editSubjectClicked(subject: Subject): void {
		const modalRef = this.modalService.open(SubjectModalComponent);
		const modal = modalRef.componentInstance as SubjectModalComponent;

		modal.isEditing = true;
		modal.subject = {
			id: subject.id,
			name: subject.name,
			lecturers: subject.lecturers,
			requiredClassroomType: subject.requiredClassroomType
		};

		modalRef.result.then(
			(updatedSubject: Subject) => {
				subject.name = updatedSubject.name;
				subject.lecturers = updatedSubject.lecturers;
				subject.requiredClassroomType = updatedSubject.requiredClassroomType;
			},
			() => { });
	}

	deleteSubjectClicked(id: number): void {
		const action = this.subjectService.deleteSubject(id);
		action.subscribe(
			() => this.subjects = this.subjects.filter(s => s.id !== id),
			() => { });

		action.connect();
	}
}
