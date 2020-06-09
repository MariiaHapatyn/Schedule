export interface Restriction {
    name: string;
    description: string;
}

export interface RestrictionSettings {
    id: number;
    restriction: Restriction;
    active: boolean;
    settings: number;
}
