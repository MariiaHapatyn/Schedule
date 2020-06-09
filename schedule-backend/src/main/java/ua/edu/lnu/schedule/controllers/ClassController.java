package ua.edu.lnu.schedule.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.enums.Semester;
import ua.edu.lnu.schedule.models.enums.ViewContextType;
import ua.edu.lnu.schedule.repositories.*;

import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/classes")
public class ClassController {
	private ClassRepository classes;
	private ClassroomRepository classrooms;
	private DepartmentRepository departments;
	private GroupRepository groups;
	private PlanRepository plans;
	private UserRepository users;

    @Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setClassrooms(ClassroomRepository classrooms) {
		this.classrooms = classrooms;
	}
	
	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}
		
	@Autowired
	public void setDepartments(DepartmentRepository departments) {
		this.departments = departments;
	}
	
	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}
	
	@Autowired
	public void setUsers(UserRepository users) {
		this.users = users;
	}

    @GetMapping
	public @ResponseBody Iterable<Class> getAll() {
		return this.classes.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Class getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Class c = this.classes.findOne(id);
		
		if (c == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return c;
	}
	
	@GetMapping("/groupId/{groupId}")
	public @ResponseBody Iterable<Class> getByGroup(
		@PathVariable("groupId") int groupId) {
		Group group = this.groups.findOne(groupId);
		
		return group == null
			? new ArrayList<>()
			: this.classes.findAllByGroupsContaining(group);
		
	}
	
	@GetMapping("/groupId/{groupId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByGroupYearSemester(
		@PathVariable("groupId") int groupId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		Group group = this.groups.findOne(groupId);
		
		return group == null
			? new ArrayList<>()
			: this.classes.findAllByGroupsContainingAndYearAndSemester(
				group, year, Semester.fromNumber(semester));
		
	}
	
	@GetMapping("/classroomId/{classroomId}")
	public @ResponseBody Iterable<Class> getByClassroom(
		@PathVariable("classroomId") int classroomId) {
		Classroom classroom = this.classrooms.findOne(classroomId);
		
		return classroom == null
			? new ArrayList<>()
			: this.classes.findAllByClassroomsContaining(classroom);
		
	}
	
	@GetMapping("/classroomId/{classroomId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByClassroomYearSemester(
		@PathVariable("classroomId") int classroomId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		Classroom classroom = this.classrooms.findOne(classroomId);
		
		return classroom == null
			? new ArrayList<>()
			: this.classes.findAllByClassroomsContainingAndYearAndSemester(
				classroom, year, Semester.fromNumber(semester));
		
	}
	
	@GetMapping("/lecturerId/{lecturerId}")
	public @ResponseBody Iterable<Class> getByLecturer(
		@PathVariable("lecturerId") int lecturerId) {
		User lecturer = this.users.findOne(lecturerId);
		
		return lecturer == null ||
				lecturer.getAuthorities()
						.stream()
						.noneMatch(authority -> authority.getName() == Authority.Name.ROLE_LECTURER)
			? new ArrayList<>()
			: this.classes.findAllByLecturersContaining(lecturer);
	}
	
	@GetMapping("/lecturerId/{lecturerId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByLecturerYearSemester(
		@PathVariable("lecturerId") int lecturerId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		User lecturer = this.users.findOne(lecturerId);
		
		return lecturer == null ||
				lecturer.getAuthorities()
						.stream()
						.noneMatch(authority ->
							authority.getName() == Authority.Name.ROLE_LECTURER)
			? new ArrayList<>()
			: this.classes.findAllByLecturersContainingAndYearAndSemester(
				lecturer, year, Semester.fromNumber(semester));
		
	}
	
	@GetMapping("/day/{day}")
	public @ResponseBody Iterable<Class> getByDay(@PathVariable("day") int day) {
		return this.classes.findAllByDayOfWeek(DayOfWeek.of(day));
	}
	
	@GetMapping("/day/{day}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByDayYearSemester(
		@PathVariable("day") int day,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.classes.findAllByDayOfWeekAndYearAndSemester(
			DayOfWeek.of(day), year, Semester.fromNumber(semester));
	}
	
	@GetMapping("/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getByYearSemester(
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.classes.findAllByYearAndSemester(
			year, Semester.fromNumber(semester));
	}

	@GetMapping("/generate/faculty/{faculty}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getGeneratedByFaculty(
		@PathVariable("faculty") int facultyId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {

		return generateForFaculty(facultyId, year, semester);
	}

	@GetMapping("/generate/{filter}/faculty/{faculty}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Class> getGeneratedByFaculty(
			@PathVariable("filter") int contextFilter,
			@PathVariable("faculty") int facultyId,
			@PathVariable("year") int year,
			@PathVariable("semester") int semester) {

		List<Class> generated = generateForFaculty(facultyId, year, semester);
		List<Class> filtered = new ArrayList<>();
		for(Class c: generated) {
			List<Group> groups = new ArrayList<>(c.getGroups());
			List<Class> groupClasses = this.classes.findAllByGroupsInAndSubjectAndTypeAndYearAndSemester(
					groups, c.getSubject(), c.getType(), year, Semester.fromNumber(semester));
			if(groupClasses.size() > 0) {
                switch (ViewContextType.fromNumber(contextFilter)) {
                    case GROUPS:
                        continue;
                    case LECTURERS:
                        if (groupClasses.stream().anyMatch(groupClass -> groupClass.getLecturers().size() > 0)) {
                            continue;
                        }
                    case CLASSROOMS:
                        continue;
                }
            }

			filtered.add(c);
		}

		return filtered;
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Class c)
		throws URISyntaxException {
		this.classes.save(c);
		return ResponseEntity.created(
			new URI("/classes/" + c.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Class c) {
		if (!this.classes.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		c.setId(id);
		this.classes.save(c);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.classes.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.classes.delete(id);
		
		return ResponseEntity.noContent().build();
	}

	private List<Class> generateForFaculty(
			int facultyId,
			int year,
			int semester) {
		List<Department> departments = this.departments.findAllByFaculty_Id(facultyId);

		List<Plan> plans = this.plans.findAllByDepartmentsInAndSemesterAndYear(
				departments, Semester.fromNumber(semester), year);

		List<Class> classes = new ArrayList<>();

		Class template = new Class();
		template.setYear(year);
		template.setSemester(Semester.fromNumber(semester));

		for (Plan plan : plans) {
			template.setSubject(plan.getSubject());

			List<Class> lectures = this.generateByPlanDetails(template, Class.Type.LECTURE, plan.getLectureDetails());
			classes.addAll(lectures);

            List<Class> practices = this.generateByPlanDetails(template, Class.Type.PRACTICE, plan.getPracticeDetails());
            classes.addAll(practices);

            List<Class> labs = this.generateByPlanDetails(template, Class.Type.LAB, plan.getLabDetails());
            classes.addAll(labs);
		}

		return classes;
	}

	private List<Class> generateByPlanDetails(Class template, Class.Type type, PlanDetails details) {
	    List<Class> classes = new ArrayList<>();
	    if(details.getFrequency() == Class.Frequency.NONE) {
	        return classes;
        }

        template.setType(type);
	    template.setFrequency(details.getFrequency());
        template.setClassroomType(details.getClassroomType());
        Set<Group> groups = details.getRelatedGroups();

        switch (details.getSpreading()) {
            case GROUP:
                classes.addAll(generateForSingleGroup(template.clone(), groups));
                break;
            case DEPARTMENT:
			case COURSE:
                template.setGroups(groups);
                classes.add(template.clone());
                break;
        }

        return classes;
    }

	private List<Class> generateForSingleGroup(Class template, Set<Group> groups) {
		List<Class> classes = new ArrayList<>();

		for (Group group : groups) {
            Class fromTemplate = template.clone();
            Set<Group> groupSet = new HashSet<>();
            groupSet.add(group);
            fromTemplate.setGroups(groupSet);

            classes.add(fromTemplate);
		}

		return classes;
	}
}
