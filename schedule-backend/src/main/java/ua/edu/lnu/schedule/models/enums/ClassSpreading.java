package ua.edu.lnu.schedule.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ClassSpreading {
    GROUP(0),
    DEPARTMENT(1),
    COURSE(2);

    private final int number;

    ClassSpreading(int number) {
        this.number = number;
    }

    @JsonValue
    public int getNumber() {
        return number;
    }

    @JsonCreator
    public static ClassSpreading fromNumber(int number) {
        return number == 0
                ? GROUP
                : number == 1
                ? DEPARTMENT
                : number == 2
                ? COURSE
                : null;
    }
}
