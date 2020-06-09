package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;

public interface UserRepository extends CrudRepository<User, Integer> {
	User findByUsername(String username);
	List<User> findAllByAuthoritiesContaining(Authority authority);

/*	List<User> findAllByFaculty_Id(Integer id);
	List<User> findAllByFaculty_IdAndAuthoritiesContaining(
		Integer id, Authority authority);*/

	List<User> findAllByDepartmentIn(List<Department> departments);

	List<User> findAllByDepartmentInAndAuthoritiesContaining(
			List<Department> departments, Authority authority);

	List<User> findAllBySubjectsContaining(Subject subject);

	List<User> findAllByRelatedDepartmentsInAndAuthoritiesContaining(
			List<Department> departments, Authority authority);

/*	List<User> findAllByFaculty_IdAndSubjectsContaining(
		Integer facultyId, Subject subject);*/

	List<User> findAllByDepartmentInAndSubjectsContaining(
			List<Department> departments, Subject subject);

	List<User> findAllByClassesContaining(Class c);

	User findByWishesContaining(Wish wish);
}
