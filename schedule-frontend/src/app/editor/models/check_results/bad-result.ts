import { Result } from "./result";

export class BadResult implements Result {
    message = "Розклад близький до оптимального.";
    icon = "fa-meh-o";
    color = "warning";
}
