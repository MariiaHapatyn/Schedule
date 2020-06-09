package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.enums.Semester;
import ua.edu.lnu.schedule.models.Wish;

public interface WishRepository extends CrudRepository<Wish, Integer> {
	List<Wish> findAllByLecturer_Id(Integer id);
	List<Wish> findAllByLecturer_IdAndYearAndSemester(Integer id, int year, Semester semester);
}
