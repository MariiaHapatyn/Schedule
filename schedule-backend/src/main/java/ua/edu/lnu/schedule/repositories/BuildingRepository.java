package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Building;

public interface BuildingRepository extends CrudRepository<Building, Integer> {
}
