import { Class, EntityBase } from "../../common/models/models";
import { ViewToggle } from "../components/helpers";
import { Observable } from "rxjs/Observable";
import { ClassModalComponent } from "../editor";

export interface ViewContext {
    toggle: ViewToggle;
    objects: EntityBase[];

    getContextObjects(facultyId: number): Observable<EntityBase[]>;
    getContextClassesForObject(objectId: number): Observable<Class[]>;
    getClassContextObjects(c: Class): EntityBase[];
    setClassContextObject(c: Class, contextObjects: EntityBase[]): Class;
    getSuitableObjects(c: Class): EntityBase[];
    getContextObjectName(obj: EntityBase): string;
    sortContextObjects(objects: EntityBase[]): EntityBase[];
    addClassContextObjectToView(c: Class, obj: EntityBase): Class;
    removeClassContextObjectFromView(c: Class, obj: EntityBase): Class;
    shouldAddToAvailableClassesOnDrop(c: Class): boolean;
    shouldAddToAvailableClassesOnUpdate(c: Class): boolean;
    setModalContext(modal: ClassModalComponent, obj: EntityBase): void;
}
