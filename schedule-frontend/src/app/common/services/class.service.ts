import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Class } from "../models/models";
import { handleError, getHeaders } from "../functions";
import { ViewToggle } from "../../editor/components/helpers";

@Injectable()
export class ClassService {
	private classesUrl = "http://localhost:8080/classes";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClasses(): Observable<Class[]> {
		return this.http.get(this.classesUrl)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClass(id: number): Observable<Class> {
		return this.http.get(`${this.classesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Class
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByGroup(groupId: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/groupId/${groupId}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByGroupAndYearAndSemester(
		groupId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/groupId/${groupId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByClassroom(classroomId: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/classroomId/${classroomId}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByClassroomAndYearAndSemester(
		classroomId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/classroomId/${classroomId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByLecturer(lecturerId: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/lecturerId/${lecturerId}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByLecturerAndYearAndSemester(
		lecturerId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/lecturerId/${lecturerId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getGeneratedClassesByFacultyAndYearAndSemester(
		facultyId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/generate/faculty/${facultyId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getGeneratedClassesByContextAndFacultyAndYearAndSemester(
		toggle: ViewToggle, facultyId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/generate/${toggle}/faculty/${facultyId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByDayOfWeek(day: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/day/${day}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassesByDayOfWeekAndYearAndSemester(
		day: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/day/${day}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null)
			.catch(handleError)
			.first();
	}

	addClass(c: Class): ConnectableObservable<Response> {
		const result = this.http.post(
			this.classesUrl,
			JSON.stringify(c),
			{headers: getHeaders()})
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			c.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateClass(c: Class): ConnectableObservable<Response> {
		return this.http.put(
			`${this.classesUrl}/${c.id}`,
			JSON.stringify(c),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteClass(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.classesUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
