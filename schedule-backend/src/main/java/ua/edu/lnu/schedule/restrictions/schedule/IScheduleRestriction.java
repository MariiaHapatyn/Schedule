package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.restrictions.IRestriction;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

public interface IScheduleRestriction extends IRestriction {
    int check(Map<DayOfWeek, List<Class>> schedule);
    int maxViolence(Map<DayOfWeek, List<Class>> schedule);
    boolean checkResult(int result);
    String getPassedMessage();
    String getFailedMessage();
}
