import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/Observable/ConnectableObservable";

import { Wish, User } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class WishService {
	private wishesUrl = "http://localhost:8080/wishes";
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getWishes(): Observable<Wish[]> {
		return this.http.get(this.wishesUrl)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null)
			.catch(handleError)
			.first();
	}

	getWish(id: number): Observable<Wish> {
		return this.http.get(`${this.wishesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish
					: null)
			.catch(handleError)
			.first();
	}

	getWishesByLecturer(lecturerId: number): Observable<Wish[]> {
		return this.http.get(`${this.wishesUrl}/lecturerId/${lecturerId}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null)
			.catch(handleError)
			.first();
	}

	getWishesByLecturerAndYearAndSemester(
		lecturerId: number, year: number, semester: number): Observable<Wish[]> {
		return this.http.get(
			`${this.wishesUrl}/lecturerId/${lecturerId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null)
			.catch(handleError)
			.first();
	}

	addWish(wish: Wish): ConnectableObservable<Response> {
		const result = this.http.post(
			this.wishesUrl,
			JSON.stringify(wish),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();

		result.subscribe((response: Response) => {
			const location = response.headers.get("Location");
			wish.id = +location.substr(location.lastIndexOf("/") + 1);
		});

		return result;
	}

	updateWish(wish: Wish): ConnectableObservable<Response> {
		return this.http.put(
			`${this.wishesUrl}/${wish.id}`,
			JSON.stringify(wish),
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}

	deleteWish(id: number): ConnectableObservable<Response> {
		return this.http.delete(
			`${this.wishesUrl}/${id}`,
			{ headers: getHeaders() })
			.catch(handleError)
			.first()
			.publish();
	}
}
