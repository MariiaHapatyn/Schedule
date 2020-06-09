import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Faculty } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class FacultyService {
	private facultiesUrl = "http://localhost:8080/faculties";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getFaculties(): Observable<Faculty[]> {
		return this.http.get(this.facultiesUrl)
			.map(response =>
				response.status === 200
					? response.json() as Faculty[]
					: null)
			.catch(handleError)
			.first();
	}

	getFaculty(id: number): Observable<Faculty> {
		return this.http.get(`${this.facultiesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Faculty
					: null)
			.catch(handleError)
			.first();
	}

	addFaculty(faculty: Faculty): ConnectableObservable<Response> {
		const result = this.http.post(
			this.facultiesUrl,
			JSON.stringify(faculty),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			faculty.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateFaculty(faculty: Faculty): ConnectableObservable<Response> {
		return this.http.put(
			`${this.facultiesUrl}/${faculty.id}`,
			JSON.stringify(faculty),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteFaculty(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.facultiesUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
