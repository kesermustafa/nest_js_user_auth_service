import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { JwtPayload, SecurityService } from '../../../../security/security.service';
import { Response } from 'express';
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { Role } from "../../domain/enums/role.enum";
import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import { UpdateMeDto } from "../dtos/update-me.dto";
import { RequestContext } from "./RequestContext";
export declare class AuthService {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly securityService;
    private readonly requestContext;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, securityService: SecurityService, requestContext: RequestContext);
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
    refresh(oldRefreshToken: string, response: Response): Promise<{
        access_token: string;
    }>;
    logout(token: string, response: Response): Promise<{
        message: string;
    }>;
    updateProfile(user: JwtPayload, dto: UpdateMeDto): Promise<{
        id: string;
        email: string;
        role: Role;
    } | {
        message: string;
    }>;
    findById(userId: string): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
    getCurrentUser(user: JwtPayload): Promise<import("../../domain/entities/user.entity").User>;
    deneme(): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
    currentUser(): Promise<{
        id: string;
        email: string;
        role: Role;
    }>;
}
