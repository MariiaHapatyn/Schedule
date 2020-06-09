package ua.edu.lnu.schedule.models.enums;

public enum ViewContextType {
    GROUPS(0),
    LECTURERS(1),
    CLASSROOMS(2);

    private final int number;

    ViewContextType(int number) {
        this.number = number;
    }

    public int getNumber() {
        return number;
    }

    public static ViewContextType fromNumber(int number) {
        return number == 0
                ? GROUPS
                : number == 1
                ? LECTURERS
                : number == 2
                ? CLASSROOMS
                : null;
    }
}
