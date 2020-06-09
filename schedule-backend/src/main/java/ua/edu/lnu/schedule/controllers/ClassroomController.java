package ua.edu.lnu.schedule.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Classroom;
import ua.edu.lnu.schedule.models.ClassroomType;
import ua.edu.lnu.schedule.models.enums.Semester;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.ClassroomRepository;
import ua.edu.lnu.schedule.repositories.ClassroomTypeRepository;

@RestController
@RequestMapping("/classrooms")
public class ClassroomController {
	private ClassRepository classes;
	private ClassroomRepository classrooms;
	private ClassroomTypeRepository classroomTypes;
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setClassrooms(ClassroomRepository classrooms)  {
		this.classrooms = classrooms;
	}
	
	@Autowired
	public void setClassroomTypes(ClassroomTypeRepository classroomTypes) {
		this.classroomTypes = classroomTypes;
	}

	@GetMapping
	public @ResponseBody Iterable<Classroom> getAll() {
		return this.classrooms.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Classroom getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Classroom classroom = this.classrooms.findOne(id);
		
		if (classroom == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return classroom;
	}
	
	@GetMapping("/classId/{classId}")
	public @ResponseBody Iterable<Classroom> getByClass(
		@PathVariable("classId") int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.classrooms.findAllByClassesContaining(c);
	}
	
	@GetMapping("/buildingId/{buildingId}")
	public @ResponseBody Iterable<Classroom> getByBuilding(
		@PathVariable("buildingId") int buildingId) {
		return this.classrooms.findAllByBuilding_Id(buildingId);
	}
	
	@GetMapping("/capacity/{capacity}")
	public @ResponseBody Iterable<Classroom> getByCapacity(
		@PathVariable("capacity") int capacity) {
		return this.classrooms.findAllByCapacityGreaterThanEqual(capacity);
	}

	@GetMapping("/typeId/{typeId}")
	public @ResponseBody Iterable<Classroom> getByType(
			@PathVariable("typeId") int typeId) {
		ClassroomType type = this.classroomTypes.findOne(typeId);

		return type == null
			? new ArrayList<>()
			: type.getType().toLowerCase(Locale.forLanguageTag("uk-UA"))
				.equals("будь-яка")
				? this.classrooms.findAll()
				: this.classrooms.findAllByType_Id(typeId);
	}
	
	@GetMapping(
		"/available/buildingId/{buildingId}/typeId/{typeId}" +
		"/day/{day}/number/{number}/frequency/{frequency}")
	public @ResponseBody Iterable<Classroom> getAvailable(
		@PathVariable("buildingId") int buildingId,
		@PathVariable("typeId") int typeId,
		@PathVariable("day") int day,
		@PathVariable("number") int number,
		@PathVariable("frequency") String frequencyName) {
		Calendar calendar = Calendar.getInstance(Locale.forLanguageTag("uk-UA"));
		
		Semester currentSemester =
			Semester.fromNumber(calendar.get(Calendar.MONTH) < 6 ? 2 : 1);
		
		Class.Frequency frequency =
			Class.Frequency.valueOf(frequencyName.toUpperCase());
		
		int currentYear = currentSemester == Semester.FIRST
			? calendar.get(Calendar.YEAR)
			: calendar.get(Calendar.YEAR) - 1;
		
		Class.Frequency weekly = Class.Frequency.WEEKLY;
		
		List<Class> potentialClasses = frequency == weekly
			? this.classes.findAllByDayOfWeekAndNumberAndYearAndSemester(
				DayOfWeek.of(day), number, currentYear, currentSemester)
			: this.classes.findAllByDayOfWeekAndNumberAndFrequencyAndYearAndSemester(
				DayOfWeek.of(day), number, frequency, currentYear, currentSemester);
		
		if (frequency != weekly) {
			potentialClasses.addAll(
				this.classes.findAllByDayOfWeekAndNumberAndFrequencyAndYearAndSemester(
					DayOfWeek.of(day), number, weekly, currentYear, currentSemester));
		}
		
		ClassroomType type = this.classroomTypes.findOne(typeId);
		
		if (type == null) {
			return new ArrayList<>();
		}
		
		List<Classroom> result = type.getType().toLowerCase(Locale.forLanguageTag("uk-UA"))
			.equals("будь-яка")
			? this.classrooms.findAllByBuilding_Id(buildingId)
			: this.classrooms.findAllByBuilding_IdAndType_Id(buildingId, typeId);
		
		return result.stream()
			.filter(cr -> potentialClasses.stream()
				.flatMap(c -> c.getClassrooms().stream())
				.noneMatch(c -> Objects.equals(c.getId(), cr.getId())))
			.collect(Collectors.toList());
	}
	
	@PostMapping
	public ResponseEntity<?> post(
		@RequestBody Classroom classroom)
		throws URISyntaxException {
		this.classrooms.save(classroom);
		
		return ResponseEntity.created(
			new URI("/classrooms/" + classroom.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Classroom classroom) {
		if (!this.classrooms.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		classroom.setId(id);
		this.classrooms.save(classroom);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.classrooms.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.classrooms.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}
