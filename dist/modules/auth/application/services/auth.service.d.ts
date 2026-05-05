import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { SecurityService } from '../../../../security/security.service';
import { Response } from 'express';
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { Role } from "../../domain/enums/role.enum";
import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import { UpdateMeDto } from "../dtos/update-me.dto";
export declare class AuthService {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly securityService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, securityService: SecurityService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
    login(dto: LoginDto, response: Response): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: Role;
        };
    }>;
    refresh(oldRefreshToken: string, response: Response): Promise<{
        access_token: string;
    }>;
    logout(token: string, response: Response): Promise<{
        message: string;
    }>;
    updateProfile(userId: string, dto: UpdateMeDto): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
}
