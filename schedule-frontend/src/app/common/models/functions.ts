import {
	Authority, Classroom, Group, User, Department, Class
} from "./models";

import {
	ClassSpreading, ClassType
} from "./enums";

export function getArrayOfNumbers(num: number): number[] {
	return Array.apply(null, { length: num }).map(Number.call, Number);
}

export function getCurrentYear(): number {
	const now = new Date();
	const year = now.getFullYear();

	return now.getMonth() > 6
		? year
		: year - 1;
}

export function getCurrentSemester(): number {
	return new Date().getMonth() > 6 ? 1 : 2;
}

export function getGroupCourse(group: Group, year: number): number {
	return group
		? year - group.year + 1
		: -1;
}

export function getCurrentGroupCourse(group: Group): number {
	return getGroupCourse(group, getCurrentYear());
}

export function getGroupName(group: Group, year: number): string {
	return group
		? group.name.replace("0", getGroupCourse(group, year).toString())
		: "";
}

export function getCurrentGroupName(group: Group): string {
	return getGroupName(group, getCurrentYear());
}

export function getClassStart(num: number): string {
	let result = "";

	if (!num) {
		return result;
	}

	switch (num) {
		case 1:
			result = "08:30";
			break;
		case 2:
			result = "10:10";
			break;
		case 3:
			result = "11:50";
			break;
		case 4:
			result = "13:30";
			break;
		case 5:
			result = "15:05";
			break;
		case 6:
			result = "16:40";
			break;
		case 7:
			result = "18:05";
			break;
		case 8:
			result = "19:35";
			break;
		case 9:
			result = "21:00";
			break;
	}

	return result;
}

export function getClassEnd(num: number): string {
	let result = "";

	if (!num) {
		return result;
	}

	switch (num) {
		case 1:
			result = "09:50";
			break;
		case 2:
			result = "11:30";
			break;
		case 3:
			result = "13:10";
			break;
		case 4:
			result = "14:50";
			break;
		case 5:
			result = "16:25";
			break;
		case 6:
			result = "18:00";
			break;
		case 7:
			result = "19:25";
			break;
		case 8:
			result = "20:55";
			break;
		case 9:
			result = "22:20";
			break;
	}

	return result;
}

export function getUserInitials(user: User): string {
	return user
		? `${user.lastName} ${user.firstName[0]}.\xA0${user.middleName[0]}.`
		: "";
}

export function getDayOfWeekNumber(day: string): number {
	let num = 0;

	switch (day.toLowerCase()) {
		case "monday":
		case "понеділок":
			num = 1;
			break;
		case "tuesday":
		case "вівторок":
			num = 2;
			break;
		case "wednesday":
		case "середа":
			num = 3;
			break;
		case "thursday":
		case "четвер":
			num = 4;
			break;
		case "friday":
		case "п'ятниця":
			num = 5;
			break;
	}

	return num;
}

export function getDayOfWeekName(day: number): string {
	let name = "";

	switch (day) {
		case 1:
			name = "Понеділок";
			break;
		case 2:
			name = "Вівторок";
			break;
		case 3:
			name = "Середа";
			break;
		case 4:
			name = "Четвер";
			break;
		case 5:
			name = "П'ятниця";
			break;
	}

	return name;
}

export function getFrequencyAsEnumString(frequency: string) {
	let result = "";

	switch (frequency.toLowerCase()) {
		case "щотижня":
			result = "weekly";
			break;
		case "по чисельнику":
			result = "numerator";
			break;
		case "по знаменнику":
			result = "denominator";
			break;
	}

	return result;
}

export function getDepartmentsAsString(departments: Department[]): string {
	return departments
		? departments.reduce(
			(result: string, department: Department) => `${result}, ${department.name}`,
			"").substr(2)
		: "";
}

export function getClassroomsAsString(classrooms: Classroom[]): string {
	return classrooms
		? classrooms.reduce(
			(result: string, classroom: Classroom) => `${result}, ${classroom.number}`,
			"").substr(2)
		: "";
}

export function getUsersAsString(users: User[]): string {
	return users
		? users.reduce(
			(result: string, lecturer: User) =>
				`${result}, ${getUserInitials(lecturer)}`,
			"").substr(2)
		: "";
}

export function getGroupsAsString(groups: Group[]): string {
	return groups
		? groups.reduce(
			(result: string, group: Group) =>
				`${result}, ${getCurrentGroupName(group)}`,
			"").substr(2)
		: "";
}

export function getAuthorityName(authority: Authority): string {
	let result = "";

	switch (authority.name) {
		case "ROLE_LECTURER":
			result = "Викладач";
			break;
		case "ROLE_EDITOR":
			result = "Редактор";
			break;
		case "ROLE_ADMIN":
			result = "Адміністратор";
			break;
	}

	return result;
}

export function getClassSpreadingName(type: number) {
	let result = "";

	switch (type) {
		case ClassSpreading.GROUP:
			result = "Для групи";
			break;
		case ClassSpreading.DEPARTMENT:
			result = "Для спеціальності";
			break;
		case ClassSpreading.COURSE:
			result = "Для курсу";
			break;
	}

	return result;
}

export function getClassTypeName(type: number) {
	switch (type) {
		case ClassType.LECTURE:
		return "Лекція";
		case ClassType.PRACTICE:
		return "Практична";
		case ClassType.LAB:
		return "Лабораторна";
		default:
		return "";
	}
}

export function compareUsersByName(u1: User, u2: User) {
	let result = u1.lastName.localeCompare(u2.lastName);

	if (result === 0) {
		result = u1.firstName.localeCompare(u2.firstName);

		if (result === 0) {
			result = u1.middleName.localeCompare(u2.middleName);
		}
	}

	return result;
}

export function compareClassesByShortName(c1: Class, c2: Class) {
	return getShortName(c1.subject.name).localeCompare(getShortName(c2.subject.name));
}

export function compareClassrooms(c1: Classroom, c2: Classroom) {
	return c1.number.localeCompare(c2.number);
}

export function groupBy<T>(xs: Array<T>, key: string): { key: any, items: T[] }[] {
	return xs.reduce((prev, item) => {
		(prev[item[key]] = prev[item[key]] || []).push(item);
		return prev;
	}, {} as any);
}

export function getShortName(name: string): string {
	let shortName = "";
	const words = name.split(" ");
	for (let i = 0; i < words.length; i++) {
		if (words[i].length <= 3) {
			shortName += shortName.length === 0
				? words[i]
				: ` ${words[i]} `;
		} else {
			shortName += words[i][0].toUpperCase();
		}
	}

	return shortName;
}
