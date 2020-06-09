package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.User;
import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.Subject;

public interface SubjectRepository extends CrudRepository<Subject, Integer> {
	Subject findByPlansContaining(Plan plan);
	List<Subject> findByPlansIn(List<Plan> plans);
	Subject findByClassesContaining(Class c);
	List<Subject> findAllByLecturersContaining(User l);
}
