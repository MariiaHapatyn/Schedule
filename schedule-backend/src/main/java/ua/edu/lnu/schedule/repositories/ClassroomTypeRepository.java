package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Classroom;
import ua.edu.lnu.schedule.models.ClassroomType;
import ua.edu.lnu.schedule.models.Class;

public interface ClassroomTypeRepository extends CrudRepository<ClassroomType, Integer> {
	ClassroomType findByClassroomsContaining(Classroom classroom);
	ClassroomType findByClassesContaining(Class c);
}
