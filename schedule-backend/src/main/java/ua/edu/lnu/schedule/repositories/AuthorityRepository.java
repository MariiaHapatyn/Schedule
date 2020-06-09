package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Authority;

public interface AuthorityRepository extends CrudRepository<Authority, Integer> {
	Authority findByName(Authority.Name name);
}
