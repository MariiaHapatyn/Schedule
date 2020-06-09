package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "groups")
public class Group implements Serializable {
	private Integer id;
	private String name;
	private int year;
	private int numStudents;

	/*private Faculty faculty;*/
	private Department department;

	private Set<Class> classes;
	/*private Set<Plan> plans;*/

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "name", nullable = false, length = 10)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "year", nullable = false)
	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	@Column(name = "num_students", nullable = false)
	public int getNumStudents() {
		return this.numStudents;
	}

	public void setNumStudents(int numStudents) {
		this.numStudents = numStudents;
	}

	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "groups")
	public Set<Class> getClasses() {
		return this.classes;
	}

	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}
/*
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "faculty", nullable = false)
	public Faculty getFaculty() {
		return this.faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}*/

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "department", nullable = false)
	public Department getDepartment() {
		return this.department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

/*	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "group")
	public Set<Plan> getPlans() {
		return this.plans;
	}

	public void setPlans(Set<Plan> plans) {
		this.plans = plans;
	}*/
}
