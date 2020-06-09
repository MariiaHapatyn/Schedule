package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Department;
import ua.edu.lnu.schedule.models.enums.ClassSpreading;
import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.enums.Semester;

public interface PlanRepository extends CrudRepository<Plan, Integer> {
	List<Plan> findAllByDepartmentsContaining(Department department);
	List<Plan> findAllByDepartmentsIn(List<Department> departments);

	List<Plan> findAllByDepartmentsContainingAndSemesterAndYear(Department department, Semester semester, int year);
	List<Plan> findAllByDepartmentsInAndSemesterAndYear(List<Department> departments, Semester semester, int year);

	List<Plan> findAllBySubject_Id(Integer id);
	List<Plan> findAllBySubject_IdAndSemesterAndYear(Integer id, Semester semester, int year);
	List<Plan> findAllBySubject_IdAndCourseAndSemesterAndYear(Integer id, int course, Semester semester, int year);
}
