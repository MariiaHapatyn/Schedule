package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Department;
import ua.edu.lnu.schedule.models.Group;
import ua.edu.lnu.schedule.models.Plan;

public interface GroupRepository extends CrudRepository<Group, Integer> {
	List<Group> findAllByYear(int year);
	List<Group> findAllByClassesContaining(Class c);
	List<Group> findAllByDepartment_Id(Integer id);
	List<Group> findAllByDepartmentIn(List<Department> departments);
	List<Group> findAllByDepartment_IdAndYear(Integer id, int year);
	List<Group> findAllByDepartmentInAndYear(List<Department> departments, int year);
	List<Group> findAllByDepartment_IdAndYearGreaterThanEqual(Integer id, int year);
	List<Group> findAllByDepartmentInAndYearGreaterThanEqual(List<Department> departments, int year);
/*	Group findByPlansContaining(Plan plan);*/
}
