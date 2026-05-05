import { Injectable } from '@nestjs/common';
import * as jose from 'jose';
import * as bcrypt from 'bcrypt';
import {ConfigService} from "@nestjs/config";

export interface JwtPayload extends jose.JWTPayload {
    sub: string;
    email: string;
    roles?: string[];
    jti?: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class SecurityService {

    private readonly secret: Uint8Array;
    constructor(private configService: ConfigService) {

        const jwtSecret = this.configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET bulunamadı! Lütfen .env dosyasını kontrol edin.');
        }

        this.secret = new TextEncoder().encode(jwtSecret);
    }

    // Şifre Karşılaştırma
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // Şifre Hashleme (Kayıt sırasında lazım olacak)
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    // JWT Oluşturma
    async generateToken(payload: JwtPayload, expiresIn: string): Promise<string> {
        const jwt = new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expiresIn);

        // Eğer payload içinde jti gönderilmemişse otomatik oluşturabiliriz
        if (!payload.jti) {
            jwt.setJti(crypto.randomUUID());
        }

        return jwt.sign(this.secret);
    }

    // JWT Doğrulama
    async verifyToken(token: string): Promise<any> {
        try {
            const { payload } = await jose.jwtVerify(token, this.secret);
            return payload;
        } catch (error) {
            return null;
        }
    }
}