package ua.edu.lnu.schedule.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.UserRepository;
import ua.edu.lnu.schedule.repositories.PlanRepository;
import ua.edu.lnu.schedule.repositories.SubjectRepository;

@RestController
@RequestMapping("/subjects")
public class SubjectController {
	private ClassRepository classes;
	private PlanRepository plans;
	private SubjectRepository subjects;
	private UserRepository lecturers;
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}
	
	@Autowired
	public void setSubjects(SubjectRepository subjects) {
		this.subjects = subjects;
	}
	
	@Autowired
	public void setLecturers(UserRepository lecturers) {
		this.lecturers = lecturers;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Subject> getAll() {
		return this.subjects.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Subject getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Subject subject = this.subjects.findOne(id);
		
		if (subject == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return subject;
	}
	
	@GetMapping("/planId/{planId}")
	public @ResponseBody Subject getByPlan(
		@PathVariable("planId") int planId, HttpServletResponse response) {
		Plan plan = this.plans.findOne(planId);
		
		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.subjects.findByPlansContaining(plan);
	}
	
	@GetMapping("/classId/{classId}")
	public @ResponseBody Subject getByClass(
		@PathVariable("classId") int classId, HttpServletResponse response) {
		Class c = this.classes.findOne(classId);
		
		if (c == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.subjects.findByClassesContaining(c);
	}
	
	@GetMapping("/lecturerId/{lecturerId}")
	public @ResponseBody Iterable<Subject> getByLecturer(
		@PathVariable("lecturerId") int lecturerId, HttpServletResponse response) {
		User lecturer = this.lecturers.findOne(lecturerId);
		
		if (lecturer == null ||
			lecturer.getAuthorities()
					.stream()
					.noneMatch(authority ->
						authority.getName() == Authority.Name.ROLE_LECTURER)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return new ArrayList<>();
		}
		
		return this.subjects.findAllByLecturersContaining(lecturer);
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Subject subject)
		throws URISyntaxException {
		this.subjects.save(subject);
		
		return ResponseEntity.created(
			new URI("/subjects/" + subject.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Subject subject) {
		if (!this.subjects.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		subject.setId(id);
		this.subjects.save(subject);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.subjects.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.subjects.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}
