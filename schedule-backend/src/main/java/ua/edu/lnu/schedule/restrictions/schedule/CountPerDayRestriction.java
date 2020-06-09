package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.restrictions.ClassesHelper;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

public class CountPerDayRestriction implements IScheduleRestriction {
    private int maxClassesPerDay = 5;

    private int weight = 8;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public int check(Map<DayOfWeek, List<Class>> schedule) {
        int count = 0;
        for(List<Class> classesPerDay : schedule.values()) {
            int size = classesPerDay.size();
            if (size > maxClassesPerDay) {
                count += size - maxClassesPerDay;
            }
        }

        return count;
    }

    @Override
    public int maxViolence(Map<DayOfWeek, List<Class>> schedule) {
        int dailyCapacity = 9;

        return ClassesHelper.reduce(schedule).size() % dailyCapacity;
    }

    @Override
    public boolean checkResult(int result) {
        return result == 0;
    }

    @Override
    public String getPassedMessage() {
        return "Кількість пар на день не перевищує дозволену.";
    }

    @Override
    public String getFailedMessage() {
        return "Кількість пар на день перевищує дозволену.";
    }
}
