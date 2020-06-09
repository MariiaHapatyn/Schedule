import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Classroom } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class ClassroomService {
	private classroomsUrl = "http://localhost:8080/classrooms";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClassrooms(): Observable<Classroom[]> {
		return this.http.get(this.classroomsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassroom(id: number): Observable<Classroom> {
		return this.http.get(`${this.classroomsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom
					: null)
			.catch(handleError)
			.first();
	}

	getClassroomsByClass(classId: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassroomsByBuilding(buildingId: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/buildingId/${buildingId}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassroomsByCapacity(capacity: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/capacity/${capacity}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null)
			.catch(handleError)
			.first();
	}

	getClassroomsByType(typeId: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/typeId/${typeId}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null)
			.catch(handleError)
			.first();
	}

	getAvailableClassrooms(
		buildingId: number,
		typeId: number,
		day: number,
		num: number,
		frequency: string): Observable<Classroom[]> {
		return this.http.get(
			`${this.classroomsUrl}/available/buildingId/${buildingId}` +
			`/typeId/${typeId}/day/${day}/number/${num}/frequency/${frequency}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null)
			.catch(handleError)
			.first();
	}

	addClassroom(classroom: Classroom): ConnectableObservable<Response> {
		const result = this.http.post(
			this.classroomsUrl,
			JSON.stringify(classroom),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			classroom.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateClassroom(classroom: Classroom): ConnectableObservable<Response> {
		return this.http.put(
			`${this.classroomsUrl}/${classroom.id}`,
			JSON.stringify(classroom),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteClassroom(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.classroomsUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
