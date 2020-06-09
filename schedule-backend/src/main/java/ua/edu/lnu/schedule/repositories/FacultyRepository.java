package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Faculty;

public interface FacultyRepository extends CrudRepository<Faculty, Integer> {
}
