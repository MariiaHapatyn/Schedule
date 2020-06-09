import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassSpreading, ClassType } from "../../../common/models/enums";
import { Plan, Subject, PlanDetails, Group, Department, ClassroomType } from "../../../common/models/models";
import { getClassSpreadingName,
	getClassTypeName,
	getGroupsAsString,
	getCurrentGroupName
} from "../../../common/models/functions";
import { PlanService, SubjectService, GroupService, DepartmentService, ClassroomTypeService } from "../../../common/services/services";
import { ClassFrequency, frequencyToString, frequencyFromString } from "../helpers";

@Component({
	selector: "schedule-editor-plan-modal",
	templateUrl: "./plan-modal.component.html"
})
export class PlanModalComponent implements OnInit {
	plan: Plan = {
		departments: [],
		course: 0,
		subject: null,
		year: 0,
		semester: 0,
		// numLectures: 0,
		// numPractices: 0,
		// numLabs: 0,
		// lectureType: LectureType.DEPARTMENT
		lectureDetails: {
			frequency: null,
			spreading: ClassSpreading.DEPARTMENT,
			relatedGroups: [],
			classroomType: null
		},
		practiceDetails: {
			frequency: null,
			spreading: ClassSpreading.DEPARTMENT,
			relatedGroups: [],
			classroomType: null
		},
		labDetails: {
			frequency: null,
			spreading: ClassSpreading.DEPARTMENT,
			relatedGroups: [],
			classroomType: null
		}
	};

	subjects: Subject[] = [];
	courseGroups: Group[] = [];
	departments: Department[] = [];
	classroomTypes: ClassroomType[] = [];
	isEditing = false;

	contextDepartment: Department;

	error = false;
	errorText = "";

	frequencyToString = frequencyToString;
	getClassSpreadingName = getClassSpreadingName;
	getGroupsAsString = getGroupsAsString;
	getCurrentGroupName = getCurrentGroupName;

	constructor(
		private activeModal: NgbActiveModal,
		private planService: PlanService,
		private subjectService: SubjectService,
		private groupService: GroupService,
		private classroomTypeService: ClassroomTypeService) {
	}

	ngOnInit(): void {
		this.subjectService.getSubjects()
			.subscribe((subjects: Subject[]) => {
				for (const department of this.departments) {
					this.planService.getPlansByDepartmentAndYearAndSemester(
						department.id, this.plan.year, this.plan.semester)
						.subscribe((plans: Plan[]) => {
							if (this.isEditing) {
								this.subjects = subjects.filter(
									s => !plans.find(
										p => (p.id !== this.plan.id) &&
											p.subject.id === s.id));

								this.plan.subject = this.subjects.find(
									s => s.id === this.plan.subject.id);
							} else {
								this.subjects = subjects;
							}
						});
					this.groupService.getGroupsByFacultyAndCourse(department.faculty.id, this.plan.course)
						.subscribe(groups => {
							this.courseGroups = groups;
							if (!this.isEditing) {
								const spreading = this.getMaxSpreading();

								this.setDepartments(spreading);
								this.setGroups(ClassType.LECTURE);
								this.setGroups(ClassType.PRACTICE);
								this.setGroups(ClassType.LAB);
							}
						});
				}
			});
		this.classroomTypeService.getClassroomTypes()
			.subscribe(types => {
				this.classroomTypes = types;

				if (!this.isEditing) {
					this.plan.lectureDetails.classroomType = types[0];
					this.plan.practiceDetails.classroomType = types[0];
					this.plan.labDetails.classroomType = types[0];
				}
			});
	}

	setGroups(classType: ClassType): void {
		switch (classType) {
			case ClassType.LECTURE:
				this.plan.lectureDetails.relatedGroups = this.getGroups(this.plan.lectureDetails);
				break;
			case ClassType.PRACTICE:
				this.plan.practiceDetails.relatedGroups = this.getGroups(this.plan.practiceDetails);
				break;
			case ClassType.LAB:
				this.plan.labDetails.relatedGroups = this.getGroups(this.plan.labDetails);
				break;
		}
	}

	setDepartments(spreading: ClassSpreading) {
		switch (spreading) {
			case ClassSpreading.COURSE:
			this.plan.departments = this.departments;
			break;
			case ClassSpreading.DEPARTMENT:
			case ClassSpreading.GROUP:
			this.plan.departments = [this.contextDepartment];
			break;
		}
	}

	getMaxSpreading(): ClassSpreading {
		const spreadings = [
			this.plan.lectureDetails.spreading,
			this.plan.practiceDetails.spreading,
			this.plan.labDetails.spreading
		];
		const spreading = spreadings.includes(ClassSpreading.COURSE)
			? ClassSpreading.COURSE
			: spreadings.includes(ClassSpreading.DEPARTMENT)
				? ClassSpreading.DEPARTMENT
				: ClassSpreading.GROUP;

		return spreading;
	}

	getFrequencySelect(): ClassFrequency[] {
		return [ClassFrequency.NONE, ClassFrequency.WEEKLY, ClassFrequency.BIWEEKLY];
	}

	getSpreadingSelect(): ClassSpreading[] {
		return [ClassSpreading.COURSE, ClassSpreading.DEPARTMENT, ClassSpreading.GROUP];
	}

	getDetailsArray(): PlanDetails[] {
		return [
			this.plan.lectureDetails,
			this.plan.practiceDetails,
			this.plan.labDetails
		];
	}

	getClassType(type: number): string {
		return getClassTypeName(type);
	}

	getGroups(details: PlanDetails): Group[] {
		const departmentIds = this.plan.departments.map(department => department.id);
		switch (details.spreading) {
			case ClassSpreading.COURSE:
				return this.courseGroups;
			case ClassSpreading.DEPARTMENT:
				return this.courseGroups.filter(g => departmentIds.includes(g.department.id));
			case ClassSpreading.GROUP:
				return this.courseGroups.filter(g => departmentIds.includes(g.department.id));
		}
	}

	groupChecked(group: Group, details: PlanDetails): void {
		const groups = [...details.relatedGroups];
		if (groups.includes(group)) {
			details.relatedGroups = groups.filter(
				g => g.id !== group.id);
		} else {
			details.relatedGroups = [...groups, group];
		}
	}

	isGroupChecked(group: Group, details: PlanDetails): boolean {
		return !!details.relatedGroups.find(g => g.id === group.id);
	}

	showGroupConfiguration(details: PlanDetails): boolean {
		return details.spreading === ClassSpreading.GROUP;
	}

	showDetails(details: PlanDetails): boolean {
		return frequencyFromString(details.frequency) !== ClassFrequency.NONE;
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.plan.subject) {
			this.error = true;
			this.errorText = "Заповніть усі поля.";
			return;
		}

		// if (this.plan.numLectures < 0 || this.plan.numPractices < 0 ||
		// 	this.plan.numLabs < 0) {
		// 	this.error = true;
		// 	this.errorText = "Кількість пар має бути невід'ємною.";
		// 	return;
		// }

		const action = this.isEditing
			? this.planService.updatePlan(this.plan)
			: this.planService.addPlan(this.plan);

		action.subscribe(
			() => this.activeModal.close(this.plan),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}
