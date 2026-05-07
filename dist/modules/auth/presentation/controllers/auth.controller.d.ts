import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto } from '../../application/dtos/auth.dto';
import { Response, Request } from 'express';
import { Role } from "../../domain/enums/role.enum";
import { UpdateMeDto } from "../../application/dtos/update-me.dto";
import { JwtPayload } from "../../../../security/security.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
    login(dto: LoginDto, response: Response): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            email: string;
            role: Role;
        };
    }>;
    refresh(request: Request, response: Response): Promise<{
        access_token: string;
    }>;
    adminTask(): Promise<string>;
    logout(request: Request, response: Response): Promise<{
        message: string;
    }>;
    updateMe(user: JwtPayload, dto: UpdateMeDto): Promise<{
        id: string;
        email: string;
        role: Role;
    } | {
        message: string;
    }>;
    getUser(request: Request): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
    getMe(user: JwtPayload): Promise<import("../../domain/entities/user.entity").User>;
    deneme(): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
}
