package ua.edu.lnu.schedule.restrictions.schedule;

public class GroupCountPerDayRestriction extends CountPerDayRestriction {

    private int weight = 8;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public String getPassedMessage() {
        return "Кількість пар на день для груп не перевищує дозволену.";
    }

    @Override
    public String getFailedMessage() {
        return "Кількість пар на день для груп перевищує дозволену.";
    }
}
