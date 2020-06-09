package ua.edu.lnu.schedule.restrictions;

import javafx.util.Pair;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Restriction;
import ua.edu.lnu.schedule.models.Wish;
import ua.edu.lnu.schedule.models.enums.RestrictionType;
import ua.edu.lnu.schedule.restrictions.schedule.IScheduleRestriction;
import ua.edu.lnu.schedule.restrictions.schedule.LecturerWishesRestriction;
import ua.edu.lnu.schedule.restrictions.single.ISingleClassRestriction;

import java.lang.reflect.InvocationTargetException;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

public class ScheduleRestrictionChecker implements IRestrictionChecker {
    private List<IScheduleRestriction> scheduleRestrictions = new ArrayList<>();
    private List<ISingleClassRestriction> singleRestrictions = new ArrayList<>();
    private Map<String, Pair<RestrictionCheckResult, String>> checkResults = new HashMap<>();

    private List<Wish> contextWishes;

    public void addScheduleRestriction(IScheduleRestriction restriction) {
        scheduleRestrictions.add(restriction);
    }

    public void addSingleRestriction(ISingleClassRestriction restriction) {
        singleRestrictions.add(restriction);
    }

    public void addRestriction(Restriction restriction) {
        try {
            if (restriction.getType() == RestrictionType.SCHEDULE) {
                IScheduleRestriction scheduleRestriction = (IScheduleRestriction) java.lang.Class
                        .forName(ScheduleRestrictionChecker.class.getPackage().getName() + ".schedule." + restriction.getName())
                        .getConstructor().newInstance();
                this.addScheduleRestriction(scheduleRestriction);
            } else {
                this.addSingleRestriction((ISingleClassRestriction) java.lang.Class
                        .forName(ScheduleRestrictionChecker.class.getPackage().getName() + ".single." + restriction.getName())
                        .getConstructor().newInstance());
            }
        } catch (NoSuchMethodException | ClassNotFoundException | InstantiationException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    public void reset() {
        scheduleRestrictions = new ArrayList<>();
        singleRestrictions = new ArrayList<>();
        checkResults = new HashMap<>();
    }

    public void resetRestrictions() {
        scheduleRestrictions = new ArrayList<>();
        singleRestrictions = new ArrayList<>();
    }

    public void resetResult() {
        checkResults = new HashMap<>();
    }

    public void setAdditionalContext(List<Wish> lecturerWishes) { this.contextWishes = lecturerWishes; }

    public CompleteResult getCheckResults() {
        double actual = 0;
        double max = 0;
        List<RestrictionCheckResult> results = checkResults.values().stream().map(Pair::getKey)
                .collect(Collectors.toList());

        for(RestrictionCheckResult checkResult : results) {
            actual += checkResult.getResult();
            max += checkResult.getViolence();
        }

        return new CompleteResult((1 - actual / max) * 100, checkResults);
    }

    @Override
    public List<RestrictionCheckResult> getCheckResult(List<Class> contextClasses) {
        List<RestrictionCheckResult> checkResults = new ArrayList<>();
        Map<DayOfWeek, List<Class>> schedule = contextClasses.stream()
                .collect(Collectors.groupingBy(Class::getDayOfWeek));
        if(schedule.size() == 0) {
            return checkResults;
        }

        Map<DayOfWeek, List<Class>> numerator = schedule.keySet().stream()
                .collect(Collectors.toMap(
                        key -> key,
                        key -> {
                            List<Class> classes = schedule.get(key).stream().filter(c ->
                                    c.getFrequency() == Class.Frequency.WEEKLY ||
                                            c.getFrequency() == Class.Frequency.NUMERATOR)
                                    .collect(Collectors.toList());
                            classes.sort(Comparator.comparingInt(Class::getNumber));

                            return classes;
                        }));

        Map<DayOfWeek, List<Class>> denominator = schedule.keySet().stream()
                .collect(Collectors.toMap(
                        key -> key,
                        key -> {
                            List<Class> classes = schedule.get(key).stream().filter(c ->
                                    c.getFrequency() == Class.Frequency.WEEKLY ||
                                            c.getFrequency() ==  Class.Frequency.DENOMINATOR)
                                    .collect(Collectors.toList());
                            classes.sort(Comparator.comparingInt(Class::getNumber));

                            return classes;
                        }));

        for(IScheduleRestriction restriction : scheduleRestrictions) {
            if(restriction.getClass().getSimpleName()
                    .equalsIgnoreCase(LecturerWishesRestriction.class.getSimpleName())) {
                ((LecturerWishesRestriction) restriction).setLecturerWishes(contextWishes);
            }

            int checkResult = restriction.check(numerator) + restriction.check(denominator);
            int maxViolence = restriction.maxViolence(numerator) + restriction.maxViolence(denominator);

            checkResults.add(getCheckResult(restriction, checkResult, maxViolence));
        }

        for (ISingleClassRestriction restriction : singleRestrictions) {
            int checkResult = restriction.check(contextClasses);
            int violence = restriction.maxViolence(contextClasses);
            checkResults.add(getCheckResult(restriction, checkResult, violence));
        }

        return checkResults;
    }

    public void saveResult(
            String contextObjectName,
            List<Class> contextObjectClasses) {
        if(contextObjectClasses.size() > 0) {
            List<RestrictionCheckResult> result = this.getCheckResult(contextObjectClasses);
            for (RestrictionCheckResult checkResult : result) {
                this.checkResults.merge(checkResult.getRestriction(), new Pair<>(
                        checkResult, contextObjectName), (prev, current) -> {
                    String prevGroups = prev.getValue();

                    if (prevGroups == null || !checkResult.isCheckPassed() && prev.getKey().isCheckPassed()) {
                        prevGroups = current.getValue();
                    } else {
                        prevGroups += ", " + current.getValue();
                    }

                    return new Pair<>(current.getKey(), prevGroups);
                });
            }
        }
    }

    private RestrictionCheckResult getCheckResult(IRestriction restriction, int checkResult, int violence) {
        boolean checkPassed = restriction.checkResult(checkResult);
        String message = "";
        int result = 0;
        if (checkPassed) {
            message = restriction.getPassedMessage();
        } else {
            result = checkResult * restriction.getWeight();
            message = restriction.getFailedMessage();
        }

        return new RestrictionCheckResult(
                restriction.getClass().getSimpleName(),
                checkPassed,
                message,
                result,
                violence * restriction.getWeight());
    }
}
