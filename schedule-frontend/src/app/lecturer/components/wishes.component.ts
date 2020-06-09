import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
	getCurrentYear, getCurrentSemester, getDayOfWeekNumber
} from "../../common/models/functions";
import { User, Wish } from '../../common/models/models';

import { WishService } from "../../common/services/wish.service";
import { AuthService } from "../../auth/services/auth.service";

import { WishModalComponent } from "./wish-modal.component";

@Component({
	selector: "schedule-lecturer-wishes",
	templateUrl: "./wishes.component.html"
})
export class WishesComponent implements OnInit {
	private modalService: NgbModal;

	private authService: AuthService;
	private wishService: WishService;

	currentLecturer: User;
	wishes: Map<number, Wish[]> = new Map();

	constructor(
		modalService: NgbModal,
		authService: AuthService,
		wishService: WishService) {
		this.modalService = modalService;
		this.authService = authService;
		this.wishService = wishService;

		this.wishes.set(1, []);
		this.wishes.set(2, []);
		this.wishes.set(3, []);
		this.wishes.set(4, []);
		this.wishes.set(5, []);
	}

	ngOnInit(): void {
		this.authService.getCurrentUser()
			.subscribe((user: User) => {
				this.currentLecturer = user;

				this.wishService.getWishesByLecturerAndYearAndSemester(
					user.id, getCurrentYear(), getCurrentSemester())
					.subscribe((wishes: Wish[]) => {
						for (const wish of wishes) {
							this.wishes.get(getDayOfWeekNumber(wish.dayOfWeek)).push(wish);
						}
					});
			});
	}

	addWishClicked(day: string): void {
		const modalRef = this.modalService.open(WishModalComponent);
		const modal = modalRef.componentInstance as WishModalComponent;

		modal.currentWish.lecturer = this.currentLecturer;
		modal.currentWish.year = getCurrentYear();
		modal.currentWish.semester = getCurrentSemester();
		modal.currentWish.dayOfWeek = day;

		modalRef.result.then(
			(newWish: Wish) => {
				const dayNumber = getDayOfWeekNumber(day);
				this.wishes.get(dayNumber).push(newWish);
				this.wishes.get(dayNumber).sort(
					(w1, w2) => {
						let result = w1.startTime.localeCompare(w2.endTime);

						if (result === 0) {
							result = w1.endTime.localeCompare(w2.endTime);
						}

						return result;
					});
			},
			() => { });
	}

	editWishClicked(wish: Wish): void {
		const modalRef = this.modalService.open(WishModalComponent);
		const modal = modalRef.componentInstance as WishModalComponent;

		modal.currentWish = {
			id: wish.id,
			dayOfWeek: wish.dayOfWeek,
			startTime: wish.startTime,
			endTime: wish.endTime,
			suitable: wish.suitable,
			comment: wish.comment,
			year: wish.year,
			semester: wish.semester,
			lecturer: wish.lecturer
		};

		modalRef.result.then(
			(newWish: Wish) => {
				wish.id = newWish.id;
				wish.dayOfWeek = newWish.dayOfWeek;
				wish.startTime = newWish.startTime;
				wish.endTime = newWish.endTime;
				wish.suitable = newWish.suitable;
				wish.comment = newWish.comment;
				wish.year = newWish.year;
				wish.semester = newWish.semester;
				wish.lecturer = newWish.lecturer;
			},
			() => { });
	}

	deleteWishClicked(id: number, dayNumber: number): void {
		const action = this.wishService.deleteWish(id);

		action.subscribe(
			() => {
				this.wishes.set(
					dayNumber,
					this.wishes.get(dayNumber).filter(wish => wish.id !== id));
			},
			() => { });

		action.connect();
	}
}
