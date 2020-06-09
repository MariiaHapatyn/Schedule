import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { RestrictionSettings } from "../models/restriction";
import { handleError, getHeaders } from "../../common/functions";
import { CheckResult } from "../models/models";

@Injectable()
export class AnalyzerService {
	private analyzerUrl = "http://localhost:8080/analyzer";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getRestrictions(facultyId: number): Observable<RestrictionSettings[]> {
		return this.http.get(`${this.analyzerUrl}/faculty/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as RestrictionSettings[]
					: null)
			.catch(handleError)
			.first();
	}

	getRestriction(id: number): Observable<RestrictionSettings> {
		return this.http.get(`${this.analyzerUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as RestrictionSettings
					: null)
			.catch(handleError)
			.first();
	}

	updateRestriction(restriction: RestrictionSettings): ConnectableObservable<Response> {
		return this.http.put(
			`${this.analyzerUrl}/${restriction.id}`,
			JSON.stringify(restriction),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	checkSchedule(facultyId: number): Observable<CheckResult> {
		return this.http.get(`${this.analyzerUrl}/check/faculty/${facultyId}`)
		.map(response =>
			response.status === 200
				? response.json() as CheckResult
				: null)
		.catch(handleError)
		.first();
	}
}
