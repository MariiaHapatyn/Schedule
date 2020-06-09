package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "classrooms")
public class Classroom implements Serializable {
	private Integer id;
	private String number;
	private int capacity;

	private ClassroomType type;
	private Building building;
	private Set<Class> classes;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "number", nullable = false, length = 10)
	public String getNumber() {
		return this.number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	@Column(name = "capacity", nullable = false)
	public int getCapacity() {
		return this.capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "type", nullable = false)
	public ClassroomType getType() {
		return this.type;
	}

	public void setType(ClassroomType type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "building", nullable = false)
	public Building getBuilding() {
		return this.building;
	}

	public void setBuilding(Building building) {
		this.building = building;
	}
	
	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "classrooms")
	public Set<Class> getClasses() {
		return this.classes;
	}

	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}
}
