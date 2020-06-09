package ua.edu.lnu.schedule.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Building;
import ua.edu.lnu.schedule.repositories.BuildingRepository;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/buildings")
public class BuildingController {
	private BuildingRepository buildings;
	
	@Autowired
	public void setBuildings(BuildingRepository buildings) {
		this.buildings = buildings;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Building> getAll() {
		return this.buildings.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Building getById(@PathVariable("id") int id) {
		return this.buildings.findOne(id);
	}
	
	@PostMapping
	public ResponseEntity<?> post(
		@RequestBody Building building)
		throws URISyntaxException {
		this.buildings.save(building);
		
		return ResponseEntity.created(
			new URI("/buildings/" + building.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Building building) {
		if (!this.buildings.exists(id)) {
			ResponseEntity.notFound().build();
		}
		
		building.setId(id);
		this.buildings.save(building);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.buildings.exists(id)) {
			ResponseEntity.notFound().build();
		}
		
		this.buildings.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}
