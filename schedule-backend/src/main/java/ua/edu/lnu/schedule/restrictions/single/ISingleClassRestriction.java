package ua.edu.lnu.schedule.restrictions.single;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.restrictions.IRestriction;

import java.util.List;

public interface ISingleClassRestriction extends IRestriction{
    int check(List<Class> classes);
    int maxViolence(List<Class> classes);
}
