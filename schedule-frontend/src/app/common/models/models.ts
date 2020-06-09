import { ClassFrequency } from "../../editor/components/helpers";
import { ClassSpreading } from "./enums";

export interface EntityBase {
	id?: number;
}

export interface Authority extends EntityBase {
	id?: number;
	name: string;
}

export interface Building extends EntityBase {
	name: string;
	street: string;
	number: string;
}

export interface Class extends EntityBase {
	number: number;
	frequency: string;
	dayOfWeek: string;
	year: number;
	semester: number;
	type: string;
	classroomType?: ClassroomType;
	subject: Subject;
	classrooms?: Classroom[];
	groups?: Group[];
	lecturers?: User[];
}

export interface Classroom extends EntityBase {
	number: string;
	capacity: number;
	type: ClassroomType;
	building: Building;
}

export interface ClassroomType extends EntityBase {
	type: string;
}

export interface Faculty extends EntityBase {
	name: string;
}

export interface Department extends EntityBase {
	name: string;
	faculty: Faculty;
	groups: Group[];
}

export interface Group extends EntityBase {
	name: string;
	numStudents: number;
	year: number;
	department: Department;
}

export interface Plan extends EntityBase {
	year: number;
	semester: number;
	subject: Subject;
	course: number;
	departments: Department[];
	lectureDetails: PlanDetails;
	practiceDetails: PlanDetails;
	labDetails: PlanDetails;
}

export interface PlanDetails extends EntityBase {
	frequency: string;
	spreading: ClassSpreading;
	classroomType: ClassroomType;
	relatedGroups: Group[];
}

export interface Subject extends EntityBase {
	name: string;
	lecturers: User[];
	requiredClassroomType: ClassroomType;
}

export interface User extends EntityBase {
	username?: string;
	password?: string;
	authorities: Authority[];

	firstName: string;
	middleName: string;
	lastName: string;
	position: string;
	department: Department;
	relatedDepartments?: Department[];
}

export interface Wish extends EntityBase {
	dayOfWeek: string;
	startTime: string;
	endTime: string;
	suitable: boolean;
	comment: string;
	year: number;
	semester: number;
	lecturer: User;
}
