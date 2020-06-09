package ua.edu.lnu.schedule.restrictions.single;

import ua.edu.lnu.schedule.infrastructure.CalendarHelper;
import ua.edu.lnu.schedule.models.Class;

import java.util.List;

public class SeniorTimeRestriction implements ISingleClassRestriction {
    private int middleCourse = 3;
    private int minNumber = 3;

    private int weight = 1;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public int check(List<Class> classes) {
        int result = 0;
        for (Class c : classes) {
            int course = CalendarHelper.CurrentYear() - c.getGroups().iterator().next().getYear();

            if (course > middleCourse && c.getNumber() < minNumber) {
                result++;
            }
        }

        return result;
    }

    @Override
    public int maxViolence(List<Class> classes) {
        return classes.size();
    }

    @Override
    public boolean checkResult(int result) {
        return result == 0;
    }

    @Override
    public String getPassedMessage() {
        return "Пари старших курсів проводяться в другу зміну.";
    }

    @Override
    public String getFailedMessage() {
        return "Пари старших курсів проводяться в першу зміну.";
    }
}