import * as jose from 'jose';
import { ConfigService } from "@nestjs/config";
export interface JwtPayload extends jose.JWTPayload {
    sub: string;
    email: string;
    roles?: string[];
    jti?: string;
    iat?: number;
    exp?: number;
}
export declare class SecurityService {
    private configService;
    private readonly secret;
    constructor(configService: ConfigService);
    comparePassword(password: string, hash: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
    generateToken(payload: JwtPayload, expiresIn: string): Promise<string>;
    verifyToken(token: string): Promise<JwtPayload | null>;
}
