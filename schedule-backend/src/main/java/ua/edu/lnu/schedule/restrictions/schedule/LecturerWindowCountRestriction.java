package ua.edu.lnu.schedule.restrictions.schedule;

public class LecturerWindowCountRestriction extends WindowCountRestriction {
    private int weight = 3;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public String getPassedMessage() {
        return "Немає вікон між парами для викладачів.";
    }

    @Override
    public String getFailedMessage() {
        return "Є вікна між парами для викладачів.";
    }
}
