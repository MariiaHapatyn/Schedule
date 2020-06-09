import * as models from "../../common/models/models";
import { getCurrentYear, getCurrentSemester } from "../../common/models/functions";
export class ClassModel implements models.Class {
    id?: number;
    number: number;    frequency: string;
    dayOfWeek: string;
    year: number = getCurrentYear();
    semester: number = getCurrentSemester();
    type: string = null;
    classroomType?: models.ClassroomType = null;
    subject: models.Subject = null;
    classrooms?: models.Classroom[] = [];
    groups?: models.Group[] = [];
    lecturers?: models.User[] = [];
}
