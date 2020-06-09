import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Faculty, Subject, User, ClassroomType } from "../../../common/models/models";
import {
	FacultyService, SubjectService, UserService, ClassroomTypeService
} from "../../../common/services/services";

import {
	compareUsersByName, getUserInitials, getUsersAsString
} from "../../../common/models/functions";

@Component({
	selector: "schedule-admin-subject-modal",
	templateUrl: "./subject-modal.component.html"
})
export class SubjectModalComponent implements OnInit {
	getUserInitials = getUserInitials;
	getUsersAsString = getUsersAsString;

	subject: Subject = {
		name: null,
		lecturers: [],
		requiredClassroomType: {
			id: 1,
			type: "Будь-яка"
		}
	};

	faculties: Faculty[] = [];
	classroomTypes: ClassroomType[] = [];
	lecturers: Map<number, User[]> = new Map();

	isEditing = false;
	error = false;
	errorText = "";

	constructor(
		private activeModal: NgbActiveModal,
		private facultySerivce: FacultyService,
		private subjectService: SubjectService,
		private userService: UserService,
		private classroomTypeService: ClassroomTypeService) {
	}

	ngOnInit(): void {
		this.facultySerivce.getFaculties()
			.subscribe((faculties: Faculty[]) => {
			this.faculties = faculties.sort((f1, f2) =>
				f1.name.localeCompare(f2.name));
			for (const faculty of faculties) {
				this.userService.getLecturersByFaculty(faculty.id)
					.subscribe((lecturers: User[]) =>
					this.lecturers.set(
						faculty.id,
						lecturers.sort(compareUsersByName)));
			}
		});
		this.classroomTypeService.getClassroomTypes()
		.subscribe(types => {
			this.classroomTypes = types;
			this.subject.requiredClassroomType = types[0];
		});
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	isLecturerChecked(lecturer: User): boolean {
		return !!this.subject.lecturers.find(l => l.id === lecturer.id);
	}

	lecturerChecked(lecturer: User): void {
		if (!!this.subject.lecturers.find(l => l.id === lecturer.id)) {
			this.subject.lecturers = this.subject.lecturers.filter(
				l => l.id !== lecturer.id);
		} else {
			this.subject.lecturers.push(lecturer);
		}
	}

	submit(): void {
		if (!this.subject.name || this.subject.name.length === 0) {
			this.error = true;
			this.errorText = "Введіть назву предмету.";
			return;
		}

		const action = this.isEditing
			? this.subjectService.updateSubject(this.subject)
			: this.subjectService.addSubject(this.subject);

		action.subscribe(
			() => this.activeModal.close(this.subject),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}
