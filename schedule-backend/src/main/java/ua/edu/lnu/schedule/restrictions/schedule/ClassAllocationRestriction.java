package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.models.Class;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ClassAllocationRestriction implements IScheduleRestriction {
    private int maxDifference = 2;

    private int weight = 5;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public int check(Map<DayOfWeek, List<Class>> schedule) {
        List<Integer> classesPerDay = schedule.values().stream().map(List::size).collect(Collectors.toList());
        Integer maxPerDay = classesPerDay.stream().reduce(Math::max).orElse(0);
        Integer minPerDay = classesPerDay.stream().reduce(Math::min).orElse(0);

        return (maxPerDay - minPerDay);
    }

    @Override
    public int maxViolence(Map<DayOfWeek, List<Class>> schedule) {
        int totalCount = schedule.values().stream().map(List::size).reduce(Math::addExact).orElse(0);

        return totalCount - 1;
    }

    @Override
    public boolean checkResult(int result) {
        return result < maxDifference;
    }

    @Override
    public String getPassedMessage() {
        return "Кількість пар рівномірно розподілена протягом тижня.";
    }

    @Override
    public String getFailedMessage() {
        return "Кількість пар нерівномірно розподілена протягом тижня.";
    }
}
