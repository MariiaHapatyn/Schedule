import { Result } from "./result";

export class UglyResult implements Result {
    message = "Розклад не можна вважати оптимальним.";
    icon = "fa-frown-o";
    color = "danger";
}
