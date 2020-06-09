package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;
import ua.edu.lnu.schedule.models.Faculty;
import ua.edu.lnu.schedule.models.RestrictionSettings;

import java.util.List;

public interface RestrictionSettingsRepository extends CrudRepository<RestrictionSettings, Integer> {
    List<RestrictionSettings> findAllByFaculty_Id(int faculty);
    List<RestrictionSettings> findAllByFaculty_IdAndActive(int faculty, boolean isActive);
}
