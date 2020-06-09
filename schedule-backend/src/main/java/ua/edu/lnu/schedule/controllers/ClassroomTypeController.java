package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.ClassroomType;
import ua.edu.lnu.schedule.models.Classroom;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.ClassroomRepository;
import ua.edu.lnu.schedule.repositories.ClassroomTypeRepository;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/classroomTypes")
public class ClassroomTypeController {
	private ClassRepository classes;
	private ClassroomRepository classrooms;
	private ClassroomTypeRepository classroomTypes;
	
	@Autowired
	public void setClasss(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setClassrooms(ClassroomRepository classrooms) {
		this.classrooms = classrooms;
	}
	
	@Autowired
	public void setClassroomTypes(ClassroomTypeRepository classroomTypes) {
		this.classroomTypes = classroomTypes;
	}

	@GetMapping
	public @ResponseBody Iterable<ClassroomType> getAll() {
		return this.classroomTypes.findAll();
	}

	@GetMapping("/{id}")
	public @ResponseBody ClassroomType getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		ClassroomType classroomType = this.classroomTypes.findOne(id);

		if (classroomType == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}

		return classroomType;
	}

	@GetMapping("/classroomId/{classroomId}")
	public @ResponseBody ClassroomType getByClassroom(
		@PathVariable("classroomId") int classroomId, HttpServletResponse response) {
		Classroom c = this.classrooms.findOne(classroomId);

		if(c == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}

		return this.classroomTypes.findByClassroomsContaining(c);
    }

	@GetMapping("/classId/{classId}")
	public @ResponseBody ClassroomType getByClass(
		@PathVariable("classId") int classId, HttpServletResponse response) {
		Class c = this.classes.findOne(classId);

		if(c == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
        }

		return this.classroomTypes.findByClassesContaining(c);
	}

	@PostMapping
	public ResponseEntity<?> post(
		@RequestBody ClassroomType classroomType)
		throws URISyntaxException {
		this.classroomTypes.save(classroomType);
		
		return ResponseEntity.created(
			new URI("/classroomTypes/" + classroomType.getId())).build();
    }

	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody ClassroomType classroomType) {
		if (!this.classrooms.exists(id)) {
			return ResponseEntity.notFound().build();
		}

		classroomType.setId(id);
		this.classroomTypes.save(classroomType);

		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.classroomTypes.exists(id)) {
			return ResponseEntity.notFound().build();
		}

		this.classroomTypes.delete(id);

		return ResponseEntity.noContent().build();
	}
}
