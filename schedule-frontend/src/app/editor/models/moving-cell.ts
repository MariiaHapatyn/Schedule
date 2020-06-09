import { ClassFrequency } from "../components/helpers";

export class MovingCell {
    viewObjectId: number;
    position: number;
    frequency: ClassFrequency;

    constructor(viewOjectId: number, position: number, frequency: ClassFrequency) {
        this.viewObjectId = viewOjectId;
        this.position = position;
        this.frequency = frequency;
    }
}
