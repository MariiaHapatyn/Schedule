package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;
import ua.edu.lnu.schedule.models.PlanDetails;

public interface PlanDetailsRepository extends CrudRepository<PlanDetails, Integer> {
}
