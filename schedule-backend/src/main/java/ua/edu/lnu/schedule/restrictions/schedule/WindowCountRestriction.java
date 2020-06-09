package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.models.Class;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

public class WindowCountRestriction implements IScheduleRestriction {

    private int weight = 1;

    @Override
    public int getWeight() {
        return weight;
    }

    public int check(Map<DayOfWeek, List<Class>> schedule) {
        int result = 0;

        for(List<Class> classes : schedule.values()){
            for(int i = 0; i < classes.size() - 1; i++) {
                Class current = classes.get(i);
                Class next = classes.get(i + 1);
                result += next.getNumber() - current.getNumber() - 1;
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
        return result == 0;
    }

    @Override
    public String getPassedMessage() {
        return "Немає вікон між парами.";
    }

    @Override
    public String getFailedMessage() {
        return "Є вікна між парами.";
    }
}
