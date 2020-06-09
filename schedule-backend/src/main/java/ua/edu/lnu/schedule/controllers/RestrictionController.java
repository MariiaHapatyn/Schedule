package ua.edu.lnu.schedule.controllers;

import javafx.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.lnu.schedule.infrastructure.CalendarHelper;
import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.repositories.*;
import ua.edu.lnu.schedule.restrictions.CompleteResult;
import ua.edu.lnu.schedule.restrictions.RestrictionCheckResult;
import ua.edu.lnu.schedule.restrictions.ScheduleRestrictionChecker;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analyzer")
public class RestrictionController {
    private RestrictionSettingsRepository restrictionSettings;
    private ClassRepository classes;
    private DepartmentRepository departments;
    private GroupRepository groups;
    private AuthorityRepository authorities;
    private UserRepository users;
    private WishRepository wishes;

    @Autowired
    public void setRestrictionSettings(RestrictionSettingsRepository restrictionSettings) {
        this.restrictionSettings = restrictionSettings;
    }

    @Autowired
    public void setWishes(WishRepository wishes) {
        this.wishes = wishes;
    }

    @Autowired
    public void setClasses(ClassRepository classes) {
        this.classes = classes;
    }

    @Autowired
    public void setDepartments(DepartmentRepository departments) {
        this.departments = departments;
    }

    @Autowired
    public void setGroups(GroupRepository groups) {
        this.groups = groups;
    }

    @Autowired
    public void setUsers(UserRepository users) {
        this.users = users;
    }

    @Autowired
    public void setAuthorities(AuthorityRepository authorities) {
        this.authorities = authorities;
    }

    @GetMapping("/faculty/{id}")
    public @ResponseBody Iterable<RestrictionSettings> getAllByFaculty(
            @PathVariable("id") int id) {
        return this.restrictionSettings.findAllByFaculty_Id(id);
    }

    @GetMapping("/{id}")
    public @ResponseBody RestrictionSettings getById(
            @PathVariable("id") int id, HttpServletResponse response) {
        RestrictionSettings restrictionSettings = this.restrictionSettings.findOne(id);

        if (restrictionSettings == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }

        return restrictionSettings;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(
            @PathVariable("id") int id,
            @RequestBody RestrictionSettings restrictionSettings) {
        if (!this.restrictionSettings.exists(id)) {
            return ResponseEntity.notFound().build();
        }

        RestrictionSettings existing = this.restrictionSettings.findOne(id);
        existing.setActive(restrictionSettings.isActive());
        existing.setSettings(restrictionSettings.getSettings());
        this.restrictionSettings.save(existing);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/faculty/{facultyId}")
//    Iterable<Pair<RestrictionCheckResult, String>> getCheckResult(
    public @ResponseBody CompleteResult getCheckResult(
            @PathVariable int facultyId
    ) {
        ScheduleRestrictionChecker checker = new ScheduleRestrictionChecker();

        List<RestrictionSettings> restrictions = this.restrictionSettings.findAllByFaculty_IdAndActive(facultyId, true);
        for (RestrictionSettings restrictionSettings :
                restrictions.stream().filter(x -> !x.getRestriction().getName().startsWith("Lecturer"))
                        .collect(Collectors.toList())) {
            Restriction restriction = restrictionSettings.getRestriction();
            checker.addRestriction(restriction);
        }

        List<Group> groups = this.groups.findAllByDepartmentIn(
                this.departments.findAllByFaculty_Id(facultyId));

        for (Group group : groups) {
            List<Class> classes = this.classes.findAllByGroupsContainingAndYearAndSemester(
                    group, CalendarHelper.CurrentYear(), CalendarHelper.CurrentSemester());

            String name = group.getName().replace(
                    "0",
                    Integer.toString(CalendarHelper.CurrentYear() - group.getYear() + 1));
            checker.saveResult(name, classes);
        }

        checker.resetRestrictions();
        for (RestrictionSettings restrictionSettings :
                restrictions.stream().filter(x -> x.getRestriction().getName().startsWith("Lecturer"))
                        .collect(Collectors.toList())) {
            Restriction restriction = restrictionSettings.getRestriction();
            checker.addRestriction(restriction);
        }

        List<User> lecturers = this.users.findAllByDepartmentInAndAuthoritiesContaining(
                this.departments.findAllByFaculty_Id(facultyId),
                this.authorities.findByName(Authority.Name.ROLE_LECTURER));

        for(User lecturer : lecturers) {
            List<Class> classes = this.classes.findAllByLecturersContainingAndYearAndSemester(
                    lecturer, CalendarHelper.CurrentYear(), CalendarHelper.CurrentSemester());
            List<Wish> wishes = this.wishes.findAllByLecturer_IdAndYearAndSemester(
                    lecturer.getId(), CalendarHelper.CurrentYear(), CalendarHelper.CurrentSemester());

            checker.setAdditionalContext(wishes);

            String name = lecturer.getLastName() + " " + lecturer.getFirstName().substring(0, 1) + ".";
            checker.saveResult(name, classes);
        }

        return checker.getCheckResults();
    }
}
