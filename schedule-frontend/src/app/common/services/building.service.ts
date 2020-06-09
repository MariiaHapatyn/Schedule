import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Building } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class BuildingService {
	private buildingsUrl = "http://localhost:8080/buildings";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getBuildings(): Observable<Building[]> {
		return this.http.get(this.buildingsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Building[]
					: null)
			.catch(handleError)
			.first();
	}

	getBuilding(id: number): Observable<Building> {
		return this.http.get(`${this.buildingsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Building
					: null)
			.catch(handleError)
			.first();
	}

	addBuilding(building: Building): ConnectableObservable<Response> {
		const result = this.http.post(
			this.buildingsUrl,
			JSON.stringify(building),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			building.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateBuilding(building: Building): ConnectableObservable<Response> {
		return this.http.put(
			`${this.buildingsUrl}/${building.id}`,
			JSON.stringify(building),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteBuilding(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.buildingsUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
