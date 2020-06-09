package ua.edu.lnu.schedule.models;

import ua.edu.lnu.schedule.models.enums.ClassSpreading;
import ua.edu.lnu.schedule.models.enums.Semester;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "plans")
public class Plan implements Serializable {
	private Integer id;
	private int numLectures;
	private int numPractices;
	private int numLabs;
	private int course;
	private Semester semester;
	private int year;
	private ClassSpreading classSpreading;

	private PlanDetails lectureDetails;
	private PlanDetails practiceDetails;
	private PlanDetails labDetails;

	private Subject subject;
	private boolean isCoreSubject;
	private Set<Department> departments;
/*	private Department department;*/

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "num_lectures", nullable = false)
	public int getNumLectures() {
		return this.numLectures;
	}

	public void setNumLectures(int numLectures) {
		this.numLectures = numLectures;
	}

	@Column(name = "num_practice", nullable = false)
	public int getNumPractices() {
		return this.numPractices;
	}

	public void setNumPractices(int numPractices) {
		this.numPractices = numPractices;
	}

	@Column(name = "num_labs", nullable = false)
	public int getNumLabs() {
		return this.numLabs;
	}

	public void setNumLabs(int numLabs) {
		this.numLabs = numLabs;
	}

	@Column(name = "course", nullable = false)
	public int getCourse() {
		return this.course;
	}

	public void setCourse(int course) {
		this.course = course;
	}

	@Column(name = "year", nullable = false)
	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	@Column(name = "semester", nullable = false)
	@Enumerated(EnumType.STRING)
	public Semester getSemester() {
		return this.semester;
	}

	public void setSemester(Semester semester) {
		this.semester = semester;
	}

	@Column(name = "lecture_type", nullable = false)
	public ClassSpreading getClassSpreading() {
		return this.classSpreading;
	}

	public void setClassSpreading(ClassSpreading classSpreading) {
		this.classSpreading = classSpreading;
	}

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "lecture_details")
	public PlanDetails getLectureDetails() {
		return lectureDetails;
	}

	public void setLectureDetails(PlanDetails lectureDetails) {
		this.lectureDetails = lectureDetails;
	}

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "practice_details")
	public PlanDetails getPracticeDetails() {
		return practiceDetails;
	}

	public void setPracticeDetails(PlanDetails practiceDetails) {
		this.practiceDetails = practiceDetails;
	}

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "lab_details")
	public PlanDetails getLabDetails() {
		return labDetails;
	}

	public void setLabDetails(PlanDetails labDetails) {
		this.labDetails = labDetails;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "subject", nullable = false)
	public Subject getSubject() {
		return this.subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "plan_departments",
	joinColumns = {
			@JoinColumn(name = "plan", nullable = false)
	},
	inverseJoinColumns = {
			@JoinColumn(name = "department", nullable = false)
	})
	public Set<Department> getDepartments() {
		return this.departments;
	}

	public void setDepartments(Set<Department> departments) {
		this.departments = departments;
	}

/*	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "department", nullable = false)
	public Department getDepartment() {
		return this.department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}*/
}
