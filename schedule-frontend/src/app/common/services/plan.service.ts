import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Plan } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class PlanService {
	private plansUrl = "http://localhost:8080/plans";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getPlans(): Observable<Plan[]> {
		return this.http.get(this.plansUrl)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null)
			.catch(handleError)
			.first();
	}

	getPlan(id: number): Observable<Plan> {
		return this.http.get(`${this.plansUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan
					: null)
			.catch(handleError)
			.first();
	}

	getPlansByGroup(groupId: number): Observable<Plan[]> {
		return this.http.get(`${this.plansUrl}/groupId/${groupId}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null)
			.catch(handleError)
			.first();
	}

	getPlansByGroupAndYearAndSemester(
		groupId: number, year: number, semester: number): Observable<Plan[]> {
		return this.http.get(
			`${this.plansUrl}/groupId/${groupId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null)
			.catch(handleError)
			.first();
	}

	getPlansByDepartmentAndYearAndSemester(
		departmentId: number, year: number, semester: number): Observable<Plan[]> {
		return this.http.get(
			`${this.plansUrl}/departmentId/${departmentId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null)
			.catch(handleError)
			.first();
	}

	getPlansBySubject(subjectId: number): Observable<Plan[]> {
		return this.http.get(`${this.plansUrl}/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null)
			.catch(handleError)
			.first();
	}

	getPlansBySubjectAndYearAndSemester(
		subjectId: number, year: number, semester: number): Observable<Plan[]> {
		return this.http.get(
			`${this.plansUrl}/subjectId/${subjectId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null)
			.catch(handleError)
			.first();
	}

	addPlan(plan: Plan): ConnectableObservable<Response> {
		const result = this.http.post(
			this.plansUrl,
			JSON.stringify(plan),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			plan.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updatePlan(plan: Plan): ConnectableObservable<Response> {
		return this.http.put(
			`${this.plansUrl}/${plan.id}`,
			JSON.stringify(plan),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deletePlan(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.plansUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
