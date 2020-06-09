import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { environment } from "../../../environments/environment";

import { Group } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class GroupService {
	private groupsUrl = "http://localhost:8080/groups";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getGroups(): Observable<Group[]> {
		return this.http.get(this.groupsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	getGroup(id: number): Observable<Group> {
		return this.http.get(`${this.groupsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null)
			.catch(handleError)
			.first();
	}

	getGroupsByYear(year: number): Observable<Group[]> {
		return this.http.get(`${this.groupsUrl}/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	getGroupsByFaculty(facultyId: number): Observable<Group[]> {
		return this.http.get(`${this.groupsUrl}/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	getGroupsByFacultyAndYear(
		facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(
			`${this.groupsUrl}/facultyId/${facultyId}/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	getGroupsByFacultyAndCourse(
		facultyId: number, course: number): Observable<Group[]> {
		return this.http.get(
			`${this.groupsUrl}/facultyId/${facultyId}/course/${course}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	getGroupsByFacultyAndYearSince(
		facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(
			`${this.groupsUrl}/facultyId/${facultyId}/since/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	getGroupsByClass(classId: number): Observable<Group[]> {
		return this.http.get(`${this.groupsUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	// getGroupByPlan(planId: number): Observable<Group> {
	// 	return this.http.get(`${this.groupsUrl}/group/planId/${planId}`)
	// 		.map(response =>
	// 			response.status === 200
	// 				? response.json() as Group
	// 				: null)
	// 		.catch(handleError)
	// 		.first();
	// }

	getAvailableGroups(
		facultyId: number,
		subjectId: number,
		day: number,
		num: number,
		frequency: string): Observable<Group[]> {
		return this.http.get(
			`${this.groupsUrl}/available/facultyId/${facultyId}` +
			`/subjectId/${subjectId}/day/${day}/number/${num}/frequency/${frequency}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null)
			.catch(handleError)
			.first();
	}

	addGroup(group: Group): ConnectableObservable<Response> {
		const result = this.http.post(
			this.groupsUrl,
			JSON.stringify(group),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			group.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateGroup(group: Group): ConnectableObservable<Response> {
		return this.http.put(
			`${this.groupsUrl}/${group.id}`,
			JSON.stringify(group),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteGroup(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.groupsUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
