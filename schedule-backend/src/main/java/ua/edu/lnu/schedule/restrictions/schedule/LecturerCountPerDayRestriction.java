package ua.edu.lnu.schedule.restrictions.schedule;

public class LecturerCountPerDayRestriction extends CountPerDayRestriction {

    private int weight = 8;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public String getPassedMessage() {
        return "Кількість пар на день для викладів не перевищує дозволену.";
    }

    @Override
    public String getFailedMessage() {
        return "Кількість пар на день для виклачів перевищує дозволену.";
    }
}
