package ua.edu.lnu.schedule.repositories;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.enums.Semester;

public interface ClassRepository extends CrudRepository<Class, Integer> {
	List<Class> findAllByGroupsContaining(Group group);
	List<Class> findAllByGroupsContainingAndYearAndSemester(
		Group group, int year, Semester semester);
	List<Class> findAllByGroupsInAndSubjectAndTypeAndYearAndSemester(
			List<Group> groups, Subject subject, Class.Type type, int year, Semester semester);
	
	List<Class> findAllByClassroomsContaining(Classroom classroom);
	List<Class> findAllByClassroomsContainingAndYearAndSemester(
		Classroom classroom, int year, Semester semester);
	
	List<Class> findAllByLecturersContaining(User lecturer);
	List<Class> findAllByLecturersContainingAndYearAndSemester(
		User lecturer, int year, Semester semester);
	
	List<Class> findAllByDayOfWeek(DayOfWeek day);
	List<Class> findAllByDayOfWeekAndYearAndSemester(
		DayOfWeek day, int year, Semester semester);
	
	List<Class> findAllByDayOfWeekAndNumber(DayOfWeek day, int number);
	List<Class> findAllByDayOfWeekAndNumberAndYearAndSemester(
		DayOfWeek day, int number, int year, Semester semester);
	
	List<Class> findAllByDayOfWeekAndNumberAndFrequency(
		DayOfWeek day, int number, Class.Frequency frequency);
	List<Class> findAllByDayOfWeekAndNumberAndFrequencyAndYearAndSemester(
		DayOfWeek day, int number, Class.Frequency frequency, int year, Semester semester);
	
	List<Class> findAllByYearAndSemester(int year, Semester semester);
}
