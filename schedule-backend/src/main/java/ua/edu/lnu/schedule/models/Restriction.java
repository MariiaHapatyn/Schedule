package ua.edu.lnu.schedule.models;

import ua.edu.lnu.schedule.models.enums.RestrictionType;

import javax.persistence.*;

@Entity
@Table(name = "restrictions")
public class Restriction {
    private String name;
    private String description;
    private RestrictionType type;

    @Id
    @Column(name = "name", nullable = false)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "description", nullable = false)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    public RestrictionType getType() {
        return type;
    }

    public void setType(RestrictionType type) {
        this.type = type;
    }
}
