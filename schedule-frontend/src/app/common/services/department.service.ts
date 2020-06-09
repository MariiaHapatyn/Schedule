import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Department } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class DepartmentService {
	private departmentsUrl = "http://localhost:8080/department";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getDepartments(): Observable<Department[]> {
		return this.http.get(this.departmentsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Department[]
					: null)
			.catch(handleError)
			.first();
	}

	getDepartment(id: number): Observable<Department> {
		return this.http.get(`${this.departmentsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Department
					: null)
			.catch(handleError)
			.first();
	}

	getDepartmentsByFaculty(facultyId: number): Observable<Department[]> {
		return this.http.get(`${this.departmentsUrl}/faculty/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Department[]
					: null)
			.catch(handleError)
			.first();
	}

	getDepartmentsByRelatedLecturer(lecturerId: number): Observable<Department[]> {
		return this.http.get(`${this.departmentsUrl}/related/${lecturerId}`)
			.map(response =>
				response.status === 200
					? response.json() as Department[]
					: null)
			.catch(handleError)
			.first();
	}

	addDepartment(department: Department): ConnectableObservable<Response> {
		const result = this.http.post(
			this.departmentsUrl,
			JSON.stringify(department),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			department.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateDepartment(department: Department): ConnectableObservable<Response> {
		return this.http.put(
			`${this.departmentsUrl}/${department.id}`,
			JSON.stringify(department),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteDepartment(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.departmentsUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
