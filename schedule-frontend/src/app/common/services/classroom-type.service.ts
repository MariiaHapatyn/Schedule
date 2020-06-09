import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { ClassroomType } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class ClassroomTypeService {
	private classroomTypesUrl = "http://localhost:8080/classroomTypes";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClassroomTypes(): Observable<ClassroomType[]> {
		return this.http.get(this.classroomTypesUrl)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassroomType(id: number): Observable<ClassroomType> {
		return this.http.get(`${this.classroomTypesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null)
			.catch(handleError)
			.first();
	}

	getClassroomTypeByClassroom(classroomId: number): Observable<ClassroomType> {
		return this.http.get(`${this.classroomTypesUrl}/classroomId/${classroomId}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null)
			.catch(handleError)
			.first();
	}

	getClassroomTypesBySubject(subjectId: number): Observable<ClassroomType> {
		return this.http.get(`${this.classroomTypesUrl}/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null)
			.catch(handleError)
			.first();
	}

	addClassroomType(classroomType: ClassroomType): ConnectableObservable<Response> {
		const result = this.http.post(
			this.classroomTypesUrl,
			JSON.stringify(classroomType),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			classroomType.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateClassroomType(classroomType: ClassroomType): ConnectableObservable<Response> {
		return this.http.put(
			`${this.classroomTypesUrl}/${classroomType.id}`,
			JSON.stringify(classroomType),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteClassroomType(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.classroomTypesUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
