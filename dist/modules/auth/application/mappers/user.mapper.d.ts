import { User } from "../../domain/entities/user.entity";
export declare class UserMapper {
    static toResponse(user: User): {
        id: string;
        email: string;
        role: import("../../domain/enums/role.enum").Role;
    };
}
