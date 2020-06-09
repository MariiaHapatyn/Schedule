package ua.edu.lnu.schedule.models;

import ua.edu.lnu.schedule.models.enums.ClassSpreading;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "plan_details")
public class PlanDetails {
    private Integer id;
    private Class.Frequency frequency;
    private ClassSpreading spreading;

    private ClassroomType classroomType;
    private Set<Group> relatedGroups;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "frequency", nullable = false)
    @Enumerated(EnumType.STRING)
    public Class.Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Class.Frequency frequency) {
        this.frequency = frequency;
    }

    @Column(name = "spreading", nullable = false)
    @Enumerated(EnumType.STRING)
    public ClassSpreading getSpreading() {
        return spreading;
    }

    public void setSpreading(ClassSpreading spreading) {
        this.spreading = spreading;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "classroom_type")
    public ClassroomType getClassroomType() {
        return classroomType;
    }

    public void setClassroomType(ClassroomType classroomType) {
        this.classroomType = classroomType;
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "plan_groups",
    joinColumns = {
            @JoinColumn(name = "plan_details", referencedColumnName = "id")
    },
    inverseJoinColumns = {
            @JoinColumn(name = "\"group\"", referencedColumnName = "id")
    })
    public Set<Group> getRelatedGroups() {
        return relatedGroups;
    }

    public void setRelatedGroups(Set<Group> relatedGroups) {
        this.relatedGroups = relatedGroups;
    }
}
