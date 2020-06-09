import { ClassFrequency, getDay, getNumber } from "../components/helpers";
import { MovingCell } from "./models";

export class Cell {
	day: number;
	number: number;
    frequency: ClassFrequency;

    constructor(movingCell: MovingCell) {
        this.day = getDay(movingCell.position);
        this.number = getNumber(movingCell.position);
        this.frequency = movingCell.frequency;
    }
}
