package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "subjects")
public class Subject implements Serializable {
	private Integer id;
	private String name;

	private Set<Plan> plans;
	private Set<Class> classes;
	private Set<User> lecturers;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "name", length = 100, nullable = false)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "subject")
	public Set<Plan> getPlans() {
		return this.plans;
	}

	public void setPlans(Set<Plan> plans) {
		this.plans = plans;
	}
	
	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "subject")
	public Set<Class> getClasses() {
		return this.classes;
	}

	public void setClasses(Set<Class> classes) {
		this.classes = classes;
	}
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
		name = "subject_user",
		joinColumns = {
			@JoinColumn(name = "subject", referencedColumnName = "id")
		},
		inverseJoinColumns = {
			@JoinColumn(name = "`user`", referencedColumnName = "id")
		})
	public Set<User> getLecturers() {
		return this.lecturers;
	}

	public void setLecturers(Set<User> lecturers) {
		this.lecturers = lecturers;
	}
}
