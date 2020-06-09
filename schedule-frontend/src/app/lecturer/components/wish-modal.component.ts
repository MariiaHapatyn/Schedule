import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Wish } from "../../common/models/models";
import { WishService } from "../../common/services/wish.service";

@Component({
	selector: "schedule-lecturer-wish",
	templateUrl: "./wish-modal.component.html"
})
export class WishModalComponent {
	private activeModal: NgbActiveModal;

	private wishService: WishService;

	currentWish: Wish = {
		dayOfWeek: null,
		startTime: "08:30:00",
		endTime: "22:20:00",
		suitable: true,
		comment: null,
		year: null,
		semester: null,
		lecturer: null
	};

	isEditing = false;

	startTimes = [
		"08:30",
		"10:10",
		"11:50",
		"13:30",
		"15:05",
		"16:40",
		"18:05",
		"19:30",
		"21:00"
	];

	endTimes = [
		"09:50",
		"11:30",
		"13:10",
		"14:50",
		"16:25",
		"18:00",
		"19:35",
		"20:55",
		"22:20"
	];

	constructor(activeModal: NgbActiveModal, wishService: WishService) {
		this.activeModal = activeModal;
		this.wishService = wishService;
	}

	submit(): void {
		const action = this.isEditing
			? this.wishService.updateWish(this.currentWish)
			: this.wishService.addWish(this.currentWish);

		action.subscribe(() => this.activeModal.close(this.currentWish), () => { });

		action.connect();
	}
}
