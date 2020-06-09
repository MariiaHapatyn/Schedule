package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Wish;
import ua.edu.lnu.schedule.restrictions.ClassesHelper;

import java.sql.Time;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class LecturerWishesRestriction implements IScheduleRestriction {

    private int weight = 5;

    @Override
    public int getWeight() {
        return weight;
    }

    private List<Wish> lecturerWishes;

    private Time[] startTimes = {
            Time.valueOf("08:30:00"),
            Time.valueOf("10:10:00"),
            Time.valueOf("11:50:00"),
            Time.valueOf("13:30:00"),
            Time.valueOf("15:05:00"),
            Time.valueOf("16:40:00"),
            Time.valueOf("18:05:00"),
            Time.valueOf("19:35:00"),
            Time.valueOf("21:00:00"),
    };

    private Time[] endTimes = {
            Time.valueOf("09:50:00"),
            Time.valueOf("11:30:00"),
            Time.valueOf("13:10:00"),
            Time.valueOf("14:50:00"),
            Time.valueOf("16:25:00"),
            Time.valueOf("18:00:00"),
            Time.valueOf("19:25:00"),
            Time.valueOf("20:55:00"),
            Time.valueOf("22:20:00"),
    };

    public void setLecturerWishes(List<Wish> lecturerWishes) {
        this.lecturerWishes = lecturerWishes;
    }

    @Override
    public int check(Map<DayOfWeek, List<Class>> lecturerSchedule) {
        int result = 0;
        for(List<Class> lecturerClasses : lecturerSchedule.values()) {
            for(Wish wish : lecturerWishes) {
                Optional<Class> c = lecturerClasses.stream().filter(cl ->  checkWishTime(wish, cl)).findAny();
                if(!wish.isSuitable() && c.isPresent()) {
                    result++;
                }
            }
        }

        return result;
    }

    @Override
    public int maxViolence(Map<DayOfWeek, List<Class>> schedule) {
        int wishesCount = lecturerWishes.stream().filter(wish -> !wish.isSuitable())
                .collect(Collectors.toList()).size();
        int classesCount = ClassesHelper.reduce(schedule).size();

        return wishesCount > classesCount ? classesCount : wishesCount;
    }

    @Override
    public boolean checkResult(int result) {
        return result == 0;
    }

    @Override
    public String getPassedMessage() {
        return "Побажання викладачів враховано.";
    }

    @Override
    public String getFailedMessage() {
        return "Побажання викладачів не враховано.";
    }

    private boolean checkWishTime(Wish wish, Class c) {
        return wish.getDayOfWeek() == c.getDayOfWeek() &&
                (wish.getStartTime().after(startTimes[c.getNumber()]) ||
                        wish.getEndTime().before(endTimes[c.getNumber()]));
    }
}
