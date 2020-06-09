import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
	getUserInitials, compareUsersByName,
	getAuthorityName
} from "../../common/models/functions";

import { Faculty, User } from "../../common/models/models";
import { FacultyService, UserService } from "../../common/services/services";

import { AuthService } from "../../auth/services/auth.service";

import { UserModalComponent } from "./user-modal.component";

@Component({
	selector: "schedule-admin-users",
	templateUrl: "./users.component.html"
})
export class UsersComponent implements OnInit {
	private modalService: NgbModal;

	private authService: AuthService;
	private facultyService: FacultyService;
	private userService: UserService;

	faculties: Faculty[] = [];
	lecturers: User[] = [];
	editors: User[] = [];
	admins: User[] = [];

	currentAdmin: User;
	currentFaculty: Faculty;

	getUserInitials = getUserInitials;
	getAuthorityName = getAuthorityName;

	constructor(
		modalService: NgbModal,
		authService: AuthService,
		facultyService: FacultyService,
		userService: UserService) {
		this.modalService = modalService;
		this.authService = authService;
		this.facultyService = facultyService;
		this.userService = userService;
	}

	ngOnInit(): void {
		this.currentFaculty = null;

		this.authService.getCurrentUser()
			.subscribe((user: User) => this.currentAdmin = user);

		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) => {
				this.faculties = faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name));
			});

		this.userService.getAdmins()
			.subscribe((admins: User[]) => this.admins = admins);
	}

	setUsers(): void {
		this.userService.getLecturersByFaculty(this.currentFaculty.id)
			.subscribe((lecturers: User[]) =>
				this.lecturers = lecturers.sort(compareUsersByName));

		this.userService.getEditorsByFaculty(this.currentFaculty.id)
			.subscribe((editors: User[]) =>
				this.editors = editors.sort(compareUsersByName));
	}

	addUser(): void {
		const modalRef = this.modalService.open(UserModalComponent);
		const modal = modalRef.componentInstance as UserModalComponent;

		modal.authorities.push({id: 1, name: "ROLE_LECTURER"});
		modal.authorities.push({id: 2, name: "ROLE_EDITOR"});
		modal.authorities.push({id: 3, name: "ROLE_ADMIN"});

		modal.faculties = this.faculties;
		modal.currentFaculty = this.currentFaculty;

		modalRef.result.then(
			(user: User) => {
				for (const authority of user.authorities) {
					switch (authority.name) {
						case "ROLE_LECTURER":
							this.lecturers.push(user);
							this.lecturers.sort(compareUsersByName);
							break;
						case "ROLE_EDITOR":
							this.editors.push(user);
							this.editors.sort(compareUsersByName);
							break;
						case "ROLE_ADMIN":
							this.admins.push(user);
							this.admins.sort(compareUsersByName);
							break;
					}
				}
			},
			() => { });
	}

	editUser(user: User): void {
		const modalRef = this.modalService.open(UserModalComponent);
		const modal = modalRef.componentInstance as UserModalComponent;

		// for (const faculty of this.faculties) {
		// 	const lecturers = this.lecturers.get(faculty.id);

		if (this.lecturers && this.lecturers.length !== 0) {
			modal.authorities.push(this.lecturers[0].authorities.find(
				a => a.name === "ROLE_LECTURER"));
			// break;
		}
		// }

		// for (const faculty of this.faculties) {
		// const editors = this.editors.get(faculty.id);

		if (this.editors && this.editors.length !== 0) {
			modal.authorities.push(this.editors[0].authorities.find(
				a => a.name === "ROLE_EDITOR"));
			// break;
		}
		// }

		modal.authorities.push(this.admins[0].authorities.find(
			a => a.name === "ROLE_ADMIN"));

		modal.faculties = this.faculties;
		modal.currentFaculty = user.department.faculty;
		modal.isEditing = true;

		modal.user = {
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			middleName: user.middleName,
			lastName: user.lastName,
			position: user.position,
			department: user.department,
			authorities: []
		};

		for (const authority of user.authorities) {
			modal.user.authorities.push(authority);
		}

		modalRef.result.then(
			(updatedUser: User) => {
				user.username = updatedUser.username;
				user.username = updatedUser.username;
				user.firstName = updatedUser.firstName;
				user.middleName = updatedUser.middleName;
				user.lastName = updatedUser.lastName;
				user.position = updatedUser.position;
				user.department = updatedUser.department;

				if (!!user.authorities.find(a => a.name === "ROLE_LECTURER")) {
					if (!updatedUser.authorities.find(a => a.name === "ROLE_LECTURER")) {
						this.lecturers = this.lecturers.filter(u => u.id !== user.id);
					} else {
						const lecturer = this.lecturers.find(l => l.id === user.id);

						lecturer.username = updatedUser.username;
						lecturer.username = updatedUser.username;
						lecturer.firstName = updatedUser.firstName;
						lecturer.middleName = updatedUser.middleName;
						lecturer.lastName = updatedUser.lastName;
						lecturer.position = updatedUser.position;
						lecturer.department = updatedUser.department;
					}
				} else if (!user.authorities.find(a => a.name === "ROLE_LECTURER") &&
					!!updatedUser.authorities.find(a => a.name === "ROLE_LECTURER")) {
					this.lecturers.push(user);
					this.lecturers.sort(compareUsersByName);
				}

				if (!!user.authorities.find(a => a.name === "ROLE_EDITOR")) {
					if (!updatedUser.authorities.find(a => a.name === "ROLE_EDITOR")) {
						this.editors = this.editors.filter(u => u.id !== user.id);
					} else {
						const editor = this.editors.find(e => e.id === user.id);

						editor.username = updatedUser.username;
						editor.username = updatedUser.username;
						editor.firstName = updatedUser.firstName;
						editor.middleName = updatedUser.middleName;
						editor.lastName = updatedUser.lastName;
						editor.position = updatedUser.position;
						editor.department = updatedUser.department;
					}
				} else if (!user.authorities.find(a => a.name === "ROLE_EDITOR") &&
					!!updatedUser.authorities.find(a => a.name === "ROLE_EDITOR")) {
					this.editors.push(user);
					this.editors.sort(compareUsersByName);
				}

				if (!!user.authorities.find(a => a.name === "ROLE_ADMIN")) {
					if (!updatedUser.authorities.find(a => a.name === "ROLE_ADMIN")) {
						this.admins = this.admins.filter(u => u.id !== user.id);
					} else {
						const admin = this.admins.find(a => a.id === user.id);

						admin.username = updatedUser.username;
						admin.username = updatedUser.username;
						admin.firstName = updatedUser.firstName;
						admin.middleName = updatedUser.middleName;
						admin.lastName = updatedUser.lastName;
						admin.position = updatedUser.position;
						admin.department = updatedUser.department;
					}
				} else if (!user.authorities.find(a => a.name === "ROLE_ADMIN") &&
					!!updatedUser.authorities.find(a => a.name === "ROLE_ADMIN")) {
					this.admins.push(user);
					this.admins.sort(compareUsersByName);
				}

				user.authorities = updatedUser.authorities;
			},
			() => { });
	}

	deleteUser(user: User): void {
		const action = this.userService.deleteUser(user.id);

		action.subscribe(
			() => {
				this.lecturers = this.lecturers.filter(
					l => l.id !== user.id);

				this.editors = this.editors.filter(
					e => e.id !== user.id);

				this.admins = this.admins.filter(a => a.id !== user.id);
			},
			() => { });

		action.connect();
	}
}
