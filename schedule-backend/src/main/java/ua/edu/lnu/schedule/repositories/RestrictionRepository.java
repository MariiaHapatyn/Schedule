package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;
import ua.edu.lnu.schedule.models.Restriction;

public interface RestrictionRepository  extends CrudRepository<Restriction, Integer> {
}
