package ua.edu.lnu.schedule.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "restriction_settings")
public class RestrictionSettings implements Serializable {
    private Integer id;
    private boolean isActive;
//    private int priority;
    private int settings;

    private Restriction restriction;
    private Faculty faculty;

    @Id
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "restriction", nullable = false)
    public Restriction getRestriction() {
        return restriction;
    }

    public void setRestriction(Restriction restriction) {
        this.restriction = restriction;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty", nullable = false)
    @JsonIgnore
    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    @Column(name = "is_active", nullable = false)
    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    @Column(name = "settings", nullable = false)
    public int getSettings() {
        return settings;
    }

    public void setSettings(int settings) {
        this.settings = settings;
    }
}
