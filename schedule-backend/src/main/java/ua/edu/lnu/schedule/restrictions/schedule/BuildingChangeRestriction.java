package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.models.Building;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Classroom;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class BuildingChangeRestriction implements IScheduleRestriction {
    private int maxChange = 2;

    private int weight = 3;

    public int getWeight() {
        return weight;
    }

    @Override
    public int check(Map<DayOfWeek, List<Class>> schedule) {
        int result = 0;
        for (List<Class> classesPerDay : schedule.values()) {
            for(int i = 0; i < classesPerDay.size() - 1; i++) {
                Set<Building> current = classesPerDay.get(i).getClassrooms()
                        .stream().map(Classroom::getBuilding)
                        .collect(Collectors.toSet());
                Set<Building> next = classesPerDay.get(i + 1).getClassrooms()
                        .stream().map(Classroom::getBuilding)
                        .collect(Collectors.toSet());
                if (current.size() > 1) {
                    result++;
                }

                if (current.removeAll(next)) {
                    result += current.size();
                }
            }
        }

        return result;
    }

    @Override
    public int maxViolence(Map<DayOfWeek, List<Class>> schedule) {
        int result = 0;

        for(List<Class> classes : schedule.values()){
            result += classes.size() - 1;
        }

        return result;
    }

    @Override
    public boolean checkResult(int result) {
        return result < maxChange;
    }

    @Override
    public String getPassedMessage() {
        return "Кількість переходів між корпусами не перевищує дозволену.";
    }

    @Override
    public String getFailedMessage() {
        return "Кількість переходів між корпусами перевищує дозволену.";
    }
}
