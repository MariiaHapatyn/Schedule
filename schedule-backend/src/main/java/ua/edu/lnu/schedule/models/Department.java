package ua.edu.lnu.schedule.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "departments")
public class Department implements Serializable {
    private Integer id;
    private String name;

    private Faculty faculty;
    private Set<Group> groups;
//    private Set<Plan> plans;
    private Set<User> lecturers;
    private Set<User> relatedLecturers;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "name", unique = true, nullable = false, length = 50)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "faculty", nullable = false)
    public Faculty getFaculty() {
        return this.faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "department")
    public Set<Group> getGroups() {
        return this.groups;
    }

    public void setGroups(Set<Group> groups) {
        this.groups = groups;
    }

//    @JsonIgnore
//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "department")
//    public Set<Plan> getPlans() {
//        return this.plans;
//    }
//
//    public void setPlans(Set<Plan> plans) {
//        this.plans = plans;
//    }

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "department")
    public Set<User> getLecturers() {
        return this.lecturers;
    }

    public void setLecturers(Set<User> lecturers) {
        this.lecturers = lecturers;
    }

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "department_user",
            joinColumns = {
                    @JoinColumn(name = "department", referencedColumnName = "id")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "`user`", referencedColumnName = "id")
            })
    public Set<User> getRelatedLecturers() {
        return this.relatedLecturers;
    }

    public void setRelatedLecturers(Set<User> lecturers) {
        this.relatedLecturers = lecturers;
    }
}
