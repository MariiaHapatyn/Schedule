package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.enums.Semester;
import ua.edu.lnu.schedule.models.Wish;
import ua.edu.lnu.schedule.repositories.WishRepository;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/wishes")
public class WishController {
	private WishRepository wishes;
	
	@Autowired
	public void setWishes(WishRepository wishes) {
		this.wishes = wishes;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Wish> getAll() {
		return this.wishes.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Wish getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Wish wish = this.wishes.findOne(id);
		
		if (wish == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return wish;
	}
	
	@GetMapping("/lecturerId/{lecturerId}")
	public @ResponseBody Iterable<Wish> getByLecturer(
		@PathVariable("lecturerId") int lecturerId) {
		return this.wishes.findAllByLecturer_Id(lecturerId);
	}
	
	@GetMapping("/lecturerId/{lecturerId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Wish> getByLecturerYearSemester(
		@PathVariable("lecturerId") int lecturerId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.wishes.findAllByLecturer_IdAndYearAndSemester(
			lecturerId, year, Semester.fromNumber(semester));
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Wish wish)
		throws URISyntaxException {
		this.wishes.save(wish);

		return ResponseEntity.created(new URI("/wishes/" + wish.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Wish group) {
		if (!this.wishes.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		group.setId(id);
		this.wishes.save(group);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.wishes.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.wishes.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}
