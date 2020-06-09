import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "../../../auth/auth";

import { Group, Plan, User, Department, PlanDetails } from "../../../common/models/models";
import {
    DepartmentService, PlanService
} from "../../../common/services/services";

import {
    getCurrentGroupName, getCurrentYear, getCurrentSemester,
    getClassSpreadingName
} from "../../../common/models/functions";

import { PlanModalComponent } from "./plan-modal.component";
import { frequencyToString, ClassFrequency, frequencyFromString } from "../helpers";

@Component({
    selector: "schedule-editor-plans",
    templateUrl: "./plans.component.html"
})
export class PlansComponent implements OnInit {

    currentUser: User;
    departments: Department[];
    plans: Map<number, Plan[]> = new Map();

    getCurrentGroupName = getCurrentGroupName;
    getClassSpreadingName = getClassSpreadingName;

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
        private departmentService: DepartmentService,
        private planService: PlanService) {
    }

    ngOnInit(): void {
        this.authService.getCurrentUser()
            .subscribe((user: User) => this.currentUser = user);

        this.departmentService.getDepartmentsByFaculty(this.currentUser.department.faculty.id)
            .subscribe((departments: Department[]) => {
                this.departments = departments.sort(
                    (d1, d2) => d1.name.localeCompare(d2.name));

                for (const department of departments) {
                    let departmentPlans: Plan[] = [];
                    this.plans.set(department.id, departmentPlans);
                    this.planService.getPlansByDepartmentAndYearAndSemester(
                        department.id,
                        getCurrentYear(),
                        getCurrentSemester())
                        .subscribe((plans: Plan[]) => {
                            departmentPlans = plans.sort((p1, p2) => p1.subject.name.localeCompare(p2.subject.name));
                            this.plans.set(department.id, departmentPlans);
                        });
                }
            });
    }

    getPlans(departmentId: number, course: number): Plan[] {
        return this.plans.get(departmentId).filter(p => p.course === course);
    }

    addPlan(department: Department, course: number): void {
        const modalRef = this.modalService.open(PlanModalComponent, { size: "lg" });
        const modal = modalRef.componentInstance as PlanModalComponent;

        modal.departments = this.departments;
        modal.contextDepartment = department;
        modal.plan.course = course;
        modal.plan.year = getCurrentYear();
        modal.plan.semester = getCurrentSemester();

        modalRef.result.then(
            (newPlan: Plan) => {
                this.plans.get(department.id).push(newPlan);
                this.plans.get(department.id).sort(
                    (p1, p2) => p1.subject.name.localeCompare(p2.subject.name));
            },
            () => { });
    }

    editPlan(plan: Plan, department: Department): void {
        const modalRef = this.modalService.open(PlanModalComponent, { size: "lg" });
        const modal = modalRef.componentInstance as PlanModalComponent;
        modal.departments = this.departments;
        modal.contextDepartment = department;

        modal.plan = {...plan};
        //     id: plan.id,
        //     department: plan.department,
        //     course: plan.course,
        //     subject: plan.subject,
        //     // numLectures: plan.numLectures,
        //     // numPractices: plan.numPractices,
        //     // numLabs: plan.numLabs,
        //     // lectureType: plan.lectureType,
        //     year: plan.year,
        //     semester: plan.semester,
        //     lectureDetails: plan.lectureDetails,
        //     practiceDetails: plan.practiceDetails,
        //     labDetails: plan.labDetails
        // };

        modal.isEditing = true;

        modalRef.result.then(
            (newPlan: Plan) => {
                plan.subject = newPlan.subject;
                // plan.numLectures = newPlan.numLectures;
                // plan.numPractices = newPlan.numPractices;
                // plan.lectureType = newPlan.lectureType;
                // plan.numLabs = newPlan.numLabs;

                for (const planDepartment of plan.departments) {
                    this.plans.get(planDepartment.id).sort(
                        (p1, p2) => p1.subject.name.localeCompare(p2.subject.name));
                }
            },
            () => { });
    }

    deletePlan(plan: Plan): void {
        const action = this.planService.deletePlan(plan.id);

        action.subscribe(
            () => {
                for (const department of plan.departments) {
                this.plans.set(
                    department.id,
                    this.plans.get(department.id).filter(p => p.id !== plan.id));
                }
            },
            () => { });

        action.connect();
    }

    getSpreading(details: PlanDetails): string {
        return frequencyFromString(details.frequency) !== ClassFrequency.NONE
            ? getClassSpreadingName(details.spreading)
            : "";
    }
}
