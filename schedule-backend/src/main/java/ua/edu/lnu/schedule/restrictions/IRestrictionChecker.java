package ua.edu.lnu.schedule.restrictions;

import ua.edu.lnu.schedule.models.Class;

import java.util.List;

public interface IRestrictionChecker {
    List<RestrictionCheckResult> getCheckResult(List<Class> contextClasses);
}
