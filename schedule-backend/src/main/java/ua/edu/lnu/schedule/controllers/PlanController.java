package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Department;
import ua.edu.lnu.schedule.models.Group;
import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.enums.Semester;
import ua.edu.lnu.schedule.repositories.DepartmentRepository;
import ua.edu.lnu.schedule.repositories.GroupRepository;
import ua.edu.lnu.schedule.repositories.PlanDetailsRepository;
import ua.edu.lnu.schedule.repositories.PlanRepository;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/plans")
public class PlanController {
	private PlanRepository plans;
	private PlanDetailsRepository planDetails;
	private GroupRepository groups;
	private DepartmentRepository departments;

	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}

    @Autowired
    public void setPlanDetails(PlanDetailsRepository planDetails) {
        this.planDetails = planDetails;
    }

	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}

	@Autowired
	public void setDepartments(DepartmentRepository departments) {
		this.departments = departments;
	}

	@GetMapping
	public @ResponseBody Iterable<Plan> getAll() {
		return this.plans.findAll();
	}

	@GetMapping("/{id}")
	public @ResponseBody Plan getById(
			@PathVariable("id") int id, HttpServletResponse response) {
		Plan plan = this.plans.findOne(id);

		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}

		return plan;
	}

	@GetMapping("/departmentId/{departmentId}")
	public @ResponseBody Iterable<Plan> getByDepartment(
			@PathVariable("departmentId") int departmentId) {
		Department department = this.departments.findOne(departmentId);
		return this.plans.findAllByDepartmentsContaining(department);
	}

	@GetMapping("/groupId/{groupId}")
	public @ResponseBody Iterable<Plan> getByGroup(
			@PathVariable("groupId") int groupId) {
		Group group = this.groups.findOne(groupId);

		return this.plans.findAllByDepartmentsContaining(group.getDepartment());
	}

	@GetMapping("/groupId/{groupId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Plan> getByGroupYearSemester(
			@PathVariable("groupId") int groupId,
			@PathVariable("year") int year,
			@PathVariable("semester") int semester) {
		Group group = this.groups.findOne(groupId);

		List<Plan> plans = this.plans.findAllByDepartmentsContainingAndSemesterAndYear(
				group.getDepartment(), Semester.fromNumber(semester), year);
		return plans;
	}

    @GetMapping("/departmentId/{departmentId}/year/{year}/semester/{semester}")
    public @ResponseBody Iterable<Plan> getByDepartmentYearSemester(
            @PathVariable("departmentId") int departmentId,
            @PathVariable("year") int year,
            @PathVariable("semester") int semester) {
        Department department = this.departments.findOne(departmentId);

        List<Plan> plans = this.plans.findAllByDepartmentsContainingAndSemesterAndYear(
                department, Semester.fromNumber(semester), year);
        return plans;
    }

	@GetMapping("/subjectId/{subjectId}")
	public @ResponseBody Iterable<Plan> getBySubject(
			@PathVariable("subjectId") int subjectId) {
		return this.plans.findAllBySubject_Id(subjectId);
	}

	@GetMapping("/subjectId/{subjectId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Plan> getBySubjectYearSemester(
			@PathVariable("subjectId") int subjectId,
			@PathVariable("year") int year,
			@PathVariable("semester") int semester) {
		return this.plans.findAllBySubject_IdAndSemesterAndYear(
				subjectId, Semester.fromNumber(semester), year);
	}

	@PostMapping
	public ResponseEntity<?> post(@RequestBody Plan plan)
			throws URISyntaxException {
	    this.planDetails.save(plan.getLectureDetails());
	    this.planDetails.save(plan.getPracticeDetails());
	    this.planDetails.save(plan.getLabDetails());
		this.plans.save(plan);

		return ResponseEntity.created(
				new URI("/plans/" + plan.getId())).build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> put(
			@PathVariable("id") int id,
			@RequestBody Plan plan) {
		if (!this.plans.exists(id)) {
			return ResponseEntity.notFound().build();
		}

		plan.setId(id);
		this.plans.save(plan);

		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.plans.exists(id)) {
			return ResponseEntity.notFound().build();
		}

		this.plans.delete(id);

		return ResponseEntity.noContent().build();
	}
}
