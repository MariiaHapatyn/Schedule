package ua.edu.lnu.schedule.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "authorities")
public class Authority implements Serializable {
	public enum Name {
		ROLE_LECTURER,
		ROLE_EDITOR,
		ROLE_ADMIN
	}
	
	private Integer id;
	private Name name;
	
	private Set<User> users;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "name", nullable = false)
	@Enumerated(EnumType.STRING)
	public Name getName() {
		return this.name;
	}
	
	public void setName(Name name) {
		this.name = name;
	}
	
	@JsonIgnore
	@ManyToMany(mappedBy = "authorities", fetch = FetchType.LAZY)
	public Set<User> getUsers() {
		return this.users;
	}
	
	public void setUsers(Set<User> users) {
		this.users = users;
	}
}
