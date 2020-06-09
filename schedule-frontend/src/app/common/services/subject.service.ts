import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Subject } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class SubjectService {
	private subjectsUrl = "http://localhost:8080/subjects";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getSubjects(): Observable<Subject[]> {
		return this.http.get(this.subjectsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Subject[]
					: null)
			.catch(handleError)
			.first();
	}

	getSubject(id: number): Observable<Subject> {
		return this.http.get(`${this.subjectsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null)
			.catch(handleError)
			.first();
	}

	getSubjectByPlan(planId: number): Observable<Subject> {
		return this.http.get(`${this.subjectsUrl}/planId/${planId}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null)
			.catch(handleError)
			.first();
	}

	getSubjectByClass(classId: number): Observable<Subject> {
		return this.http.get(`${this.subjectsUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null)
			.catch(handleError)
			.first();
	}

	getSubjectsByLecturer(lecturerId: number): Observable<Subject[]> {
		return this.http.get(`${this.subjectsUrl}/lecturerId/${lecturerId}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject[]
					: null)
			.catch(handleError)
			.first();
	}

	addSubject(subject: Subject): ConnectableObservable<Response> {
		const result = this.http.post(
			this.subjectsUrl,
			JSON.stringify(subject),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			subject.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateSubject(subject: Subject): ConnectableObservable<Response> {
		return this.http.put(
			`${this.subjectsUrl}/${subject.id}`,
			JSON.stringify(subject),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteSubject(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.subjectsUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
