import {Role} from "../enums/role.enum";

export class User {
    id?: string;
    email: string;
    password?: string;
    role?: Role;
}