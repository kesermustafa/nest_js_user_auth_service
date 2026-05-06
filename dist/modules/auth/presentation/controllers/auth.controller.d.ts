import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto } from '../../application/dtos/auth.dto';
import { Response, Request } from 'express';
import { Role } from "../../domain/enums/role.enum";
import { UpdateMeDto } from "../../application/dtos/update-me.dto";
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
    updateMe(userId: string, dto: UpdateMeDto): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
}
