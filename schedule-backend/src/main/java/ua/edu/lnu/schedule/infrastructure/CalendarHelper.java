package ua.edu.lnu.schedule.infrastructure;

import ua.edu.lnu.schedule.models.enums.Semester;

import java.util.Calendar;
import java.util.Locale;

public class CalendarHelper {
    private Semester currentSemester;
    private int currentYear;

    public static Semester CurrentSemester() {
        Calendar calendar = Calendar.getInstance(Locale.forLanguageTag("uk-UA"));
        return Semester.fromNumber(calendar.get(Calendar.MONTH) < 6 ? 2 : 1);
    }

    public static int CurrentYear() {
        Calendar calendar = Calendar.getInstance(Locale.forLanguageTag("uk-UA"));
        Semester currentSemester =
                Semester.fromNumber(calendar.get(Calendar.MONTH) < 6 ? 2 : 1);

        return currentSemester == Semester.FIRST
                ? calendar.get(Calendar.YEAR)
                : calendar.get(Calendar.YEAR) - 1;
    }
}
