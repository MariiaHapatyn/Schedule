import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { User } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class UserService {
	private usersUrl = "http://localhost:8080/users";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getUsers(): Observable<User[]> {
		return this.http.get(this.usersUrl)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getLecturers(): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/role/lecturer`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getEditors(): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/role/editor`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getAdmins(): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/role/admin`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getUser(id: number): Observable<User> {
		return this.http.get(`${this.usersUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null)
			.catch(handleError)
			.first();
	}

	getUsersByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getLecturersByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(
			`${this.usersUrl}/role/lecturer/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getLecturersByFacultyIncludeRelated(facultyId: number): Observable<User[]> {
		return this.http.get(
			`${this.usersUrl}/role/lecturer/facultyId/${facultyId}/includeRelated`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getEditorsByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(
			`${this.usersUrl}/role/editor/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getLecturersBySubject(subjectId: number): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getLecturersByClass(classId: number): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	getLecturerByWish(wishId: number): Observable<User> {
		return this.http.get(`${this.usersUrl}/lecturer/wishId/${wishId}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null)
			.catch(handleError)
			.first();
	}

	getAvailableLecturers(
		facultyId: number,
		subjectId: number,
		day: number,
		num: number,
		frequency: string): Observable<User[]> {
		return this.http.get(
			`${this.usersUrl}/available/facultyId/${facultyId}` +
			`/subjectId/${subjectId}/day/${day}/number/${num}/frequency/${frequency}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null)
			.catch(handleError)
			.first();
	}

	addUser(user: User): ConnectableObservable<Response> {
		const result = this.http.post(
			`${this.usersUrl}`,
			JSON.stringify(user),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			user.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	addUserToRole(user: User, role: string): ConnectableObservable<Response> {
		return this.http.post(
			`${this.usersUrl}/${user.id}/roles/add/${role}`,
			{ },
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	removeUserFromRole(user: User, role: string): ConnectableObservable<Response> {
		return this.http.post(
			`${this.usersUrl}/${user.id}/roles/remove/${role}`,
			{ },
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	updateUser(user: User): ConnectableObservable<Response> {
		return this.http.put(
			`${this.usersUrl}/${user.id}`,
			JSON.stringify(user),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteUser(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.usersUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
