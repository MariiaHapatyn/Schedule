package ua.edu.lnu.schedule.restrictions;

import ua.edu.lnu.schedule.models.Class;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ClassesHelper {
    public static List<Class> reduce(Map<DayOfWeek, List<Class>> schedule) {
        return schedule.values().stream().reduce((list1, list2) ->
                Stream.concat(list1.stream(), list2.stream()).collect(Collectors.toList()))
                .orElse(new ArrayList<>());
    }
}
