import { Result } from "./result";

export class GoodResult implements Result {
    message = "Розклад можна вважати оптимальним.";
    icon = "fa-smile-o";
    color = "success";
}
