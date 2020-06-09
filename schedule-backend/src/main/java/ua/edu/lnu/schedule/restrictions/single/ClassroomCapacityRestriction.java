package ua.edu.lnu.schedule.restrictions.single;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Classroom;
import ua.edu.lnu.schedule.models.Group;

import java.util.List;

public class ClassroomCapacityRestriction implements ISingleClassRestriction {
    private int maxDifference = 20;

    private int weight = 1;

    @Override
    public int getWeight() {
        return weight;
    }

    @Override
    public int check(List<Class> classes) {
        int result = 0;
        for (Class c : classes) {
            int groupsCapacity = c.getGroups().stream()
                    .map(Group::getNumStudents)
                    .reduce((g1, g2) -> g1 + g2).get();
            int classroomCapacity = c.getClassrooms().stream()
                    .map(Classroom::getCapacity)
                    .reduce((c1, c2) -> c1 + c2).get();
            if (classroomCapacity - groupsCapacity > maxDifference) {
                result++;
            }
        }

        return result;
    }

    @Override
    public int maxViolence(List<Class> classes) {
        return classes.size();
    }

    @Override
    public boolean checkResult(int result) {
        return result == 0;
    }

    @Override
    public String getPassedMessage() {
        String passedMessage = "Місткість аудиторій відповідає кількості студентів.";
        return passedMessage;
    }

    @Override
    public String getFailedMessage() {
        String failedMessage = "Місткість аудиторій значно перевищує кількість студентів.";
        return failedMessage;
    }
}
