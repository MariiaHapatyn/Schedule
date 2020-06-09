import * as models from "../../common/models/models";

export enum ClassFrequency {
	NONE,
	WEEKLY,
	NUMERATOR,
	DENOMINATOR,
	BIWEEKLY
}

export enum ViewToggle {
    GROUPS,
	LECTURERS,
	CLASSROOMS
}

export class ClassCell {
	n: number;
	frequency: ClassFrequency;
	weekly: models.Class;
	numerator: models.Class;
	denominator: models.Class;
}

export function frequencyFromString(frequency: string): ClassFrequency {
	let result = ClassFrequency.NONE;
	switch (frequency) {
		case "Щотижня":
		result = ClassFrequency.WEEKLY;
		break;
		case "По чисельнику":
		result = ClassFrequency.NUMERATOR;
		break;
		case "По знаменнику":
		result = ClassFrequency.DENOMINATOR;
		break;
		case "Через тиждень":
		result = ClassFrequency.BIWEEKLY;
		break;
	}

	return result;
}

export function frequencyToString(frequency: ClassFrequency): string {
	switch (frequency) {
		case ClassFrequency.NONE:
			return "Немає";
		case ClassFrequency.WEEKLY:
			return "Щотижня";
		case ClassFrequency.NUMERATOR:
			return "По чисельнику";
		case ClassFrequency.DENOMINATOR:
			return "По знаменнику";
        case ClassFrequency.BIWEEKLY:
			return "Через тиждень";
		default:
			return "";
	}
}

export function getDay(n: number): number {
	return Math.floor(n / 9 + 1);
}

export function getNumber(n: number): number {
	return n % 9 + 1;
}

export function getArrayOfNumbers(num: number): number[] {
	return Array.apply(null, { length: num }).map(Number.call, Number);
}

export function isClassFull(c: models.Class): boolean {
	return c
		&& c.dayOfWeek
		&& c.number > 0
		&& c.groups !== null && c.groups.length > 0
		&& c.lecturers !== null && c.lecturers.length > 0
		&& c.classrooms !== null && c.classrooms.length > 0;
}
