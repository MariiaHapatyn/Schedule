import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "../../../auth/auth";

import { Group, User } from "../../../common/models/models";
import {
    GroupService
} from "../../../common/services/services";

import {
    getCurrentGroupName, getCurrentYear, getCurrentSemester
} from "../../../common/models/functions";

import { GroupModalComponent } from "./group-modal.component";

@Component({
    selector: "schedule-editor-groups",
    templateUrl: "./groups.component.html"
})
export class GroupsComponent implements OnInit {
    private modalService: NgbModal;

    private router: Router;
    private authService: AuthService;
    private groupService: GroupService;

    currentUser: User;
    groups: Group[];

    getCurrentGroupName = getCurrentGroupName;

    constructor(
        modalService: NgbModal,
        router: Router,
        authService: AuthService,
        groupService: GroupService) {
        this.modalService = modalService;
        this.router = router;
        this.authService = authService;
        this.groupService = groupService;
    }

    ngOnInit(): void {
        this.authService.getCurrentUser()
            .subscribe((user: User) => this.currentUser = user);

        this.groupService.getGroupsByFaculty(this.currentUser.department.faculty.id)
            .subscribe((groups: Group[]) => {
                this.groups = groups.sort(
                    (g1, g2) => getCurrentGroupName(g1).localeCompare(getCurrentGroupName(g2)));
            });
    }

    addGroup(): void {
        const modalRef = this.modalService.open(GroupModalComponent);
        const modal = modalRef.componentInstance as GroupModalComponent;

        modal.facultyId = this.currentUser.department.faculty.id;
        modal.group.year = getCurrentYear();

        modalRef.result.then(
            (newGroup: Group) => {
                this.groups.push(newGroup);
                this.groups.sort((g1, g2) => g1.name.localeCompare(g2.name));
            },
            () => { });
    }

    editGroup(group: Group): void {
        const modalRef = this.modalService.open(GroupModalComponent);
        const modal = modalRef.componentInstance as GroupModalComponent;

        modal.facultyId = this.currentUser.department.faculty.id;

        modal.group = {
            id: group.id,
            name: group.name,
            department: group.department,
            numStudents: group.numStudents,
            year: group.year
        };

        modal.isEditing = true;

        modalRef.result.then(
            (newGroup: Group) => {
                group.name = newGroup.name;
                group.numStudents = newGroup.numStudents;

                this.groups.sort((g1, g2) => g1.name.localeCompare(g2.name));
            },
            () => { });
    }

    deleteGroup(id: number): void {
        const action = this.groupService.deleteGroup(id);

        action.subscribe(
            () => this.groups = this.groups.filter(g => g.id !== id),
            () => { });

        action.connect();
    }
}
