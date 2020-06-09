package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.infrastructure.CalendarHelper;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.enums.Semester;
import ua.edu.lnu.schedule.restrictions.ClassesHelper;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ClassTypeRestriction implements IScheduleRestriction {

    private int weight = 5;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public int check(Map<DayOfWeek, List<Class>> schedule) {
        int result = 0;
        List<Class> classes = ClassesHelper.reduce(schedule);

        List<Class> lectures = classes.stream().filter(c -> c.getType() == Class.Type.LECTURE)
                .collect(Collectors.toList());
        for (Class lecture : lectures) {
            Optional<Class> other = classes.stream().filter(c ->
                    c.getSubject().getId().equals(lecture.getSubject().getId()) &&
                            c.getType() != Class.Type.LECTURE)
                    .findFirst();
            if(other.isPresent() && getClassPosition(lecture) > getClassPosition(other.get())) {
                result++;
            }
        }

        return result;
    }

    @Override
    public int maxViolence(Map<DayOfWeek, List<Class>> schedule) {
        List<Class> classes = ClassesHelper.reduce(schedule);
        List<Class> lectures = classes.stream().filter(c -> c.getType() == Class.Type.LECTURE)
                .collect(Collectors.toList());

        return lectures.size();
    }

    @Override
    public boolean checkResult(int result) {
        return result == 0;
    }

    @Override
    public String getPassedMessage() {
        return "Лекції проводяться перед практичними чи лабораторними.";
    }

    @Override
    public String getFailedMessage() {
        return "Лекції проводяться після практичних чи лабораторних.";
    }

    private int getClassPosition(Class c) {
        int coefficient = c.getFrequency() == Class.Frequency.WEEKLY
                ? 3
                : c.getFrequency() == Class.Frequency.NUMERATOR && CalendarHelper.CurrentSemester() == Semester.FIRST
                    ? 2
                    : 1;

        return c.getDayOfWeek().getValue() * c.getNumber() * coefficient;
    }
}
