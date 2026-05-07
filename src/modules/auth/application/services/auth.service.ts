import {Inject, Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import {JwtPayload, SecurityService} from '../../../../security/security.service';
import { UserMapper } from '../mappers/user.mapper';
import { Response, Request } from 'express';
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import * as crypto from 'crypto';
import {Role} from "../../domain/enums/role.enum";
import {IRefreshTokenRepository} from "../../domain/repositories/refresh-token.repository.interface";
import {UpdateMeDto} from "../dtos/update-me.dto";
import {get} from "mongoose";
import {RequestContext} from "./RequestContext";


@Injectable()
export class AuthService {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,

        @Inject('IRefreshTokenRepository')
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly securityService: SecurityService,

        private readonly requestContext: RequestContext
    ) {}

    async register(dto: RegisterDto) {
        const exists = await this.userRepository.findByEmail(dto.email);
        if (exists) {
            throw new ConflictException('Bu e-posta adresi zaten kullanımda');
        }

        const hashedPassword = await this.securityService.hashPassword(dto.password);

        const user = await this.userRepository.create({
            ...dto,
            password: hashedPassword
        });

        return UserMapper.toResponse(user);
    }

    async login(dto: LoginDto, response: Response) {
        const user = await this.userRepository.findByEmail(dto.email);
        const isPasswordValid = user
            ? await this.securityService.comparePassword(dto.password, user.password!)
            : false;

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('E-posta veya şifre hatalı');
        }

        const userId = user.id.toString();
        const jti = crypto.randomUUID();

        const payload = {
            sub: userId,
            email: user.email,
            role: user.role as Role,
            jti: jti
        };

        await this.refreshTokenRepository.limitUserTokens(userId, 2);

        const accessToken = await this.securityService.generateToken(payload, '30m');
        const refreshToken = await this.securityService.generateToken(payload, '2d');

        // DB'ye kaydet (Ayrı tabloya)
        const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        await this.refreshTokenRepository.create(userId, jti, expiresAt);

        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        return {
            message: 'Başarıyla giriş yapıldı',
            access_token: accessToken,
            user: UserMapper.toResponse(user)
        };
    }

    async refresh(oldRefreshToken: string, response: Response) {
        if (!oldRefreshToken) throw new UnauthorizedException('Token bulunamadı');

        // 1. Token'ı doğrula
        const payload = await this.securityService.verifyToken(oldRefreshToken);
        if (!payload || !payload.jti) {
            throw new UnauthorizedException('Geçersiz token');
        }

        // 2. DB'de bu JTI var mı kontrol et
        const isTokenValid = await this.refreshTokenRepository.exists(payload.jti as string);

        if (!isTokenValid) {
            // KRİTİK GÜVENLİK ANI: Reuse Attack tespiti
            await this.refreshTokenRepository.deleteAllByUserId(payload.sub as string);
            throw new UnauthorizedException('Güvenlik ihlali tespit edildi! Lütfen tekrar giriş yapın.');
        }

        // 3. Eski tokenı DB'den SİL (Tek kullanımlık hale getiriyoruz)
        await this.refreshTokenRepository.deleteByJti(payload.jti as string);

        // 4. YENİ Token setini hazırla
        const newJti = crypto.randomUUID();
        const newPayload = {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
            jti: newJti
        };

        const newAccessToken = await this.securityService.generateToken(newPayload, '30m');
        const newRefreshToken = await this.securityService.generateToken(newPayload, '2d');

        // 5. Yeni JTI'yi DB'ye kaydet
        const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        await this.refreshTokenRepository.create(payload.sub as string, newJti, expiresAt);

        // 6. Yeni Refresh Token'ı Cookie'ye yaz
        response.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        return { access_token: newAccessToken };
    }

    async logout(token: string, response: Response) {
        if (token) {
            const payload = await this.securityService.verifyToken(token);
            if (payload?.jti) {
                // Sadece bu cihazın oturumunu DB'den sil
                await this.refreshTokenRepository.deleteByJti(payload.jti as string);
            }
        }

        response.clearCookie('refresh_token');
        return { message: 'Başarıyla çıkış yapıldı' };
    }

    async updateProfile(user:JwtPayload, dto: UpdateMeDto) {

        const userId = user.sub;

        // 1. Eğer email güncellenmek isteniyorsa, başkasında var mı bak
        if (dto.email) {
            const existingUser = await this.userRepository.findByEmail(dto.email);

            // Önemli: Bulunan kullanıcı BEN değilsem hata ver (ID kontrolü)
            if (existingUser && existingUser.id !== userId) {
                throw new ConflictException('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor');
            }
        }

        if(dto.email === user.email ){
            return {
                message: "degisiklik yapmadiniz"
            }
        }

        // 2. Güncelleme işlemini yap
        const updatedUser = await this.userRepository.update(userId, dto);

        if (!updatedUser) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        return UserMapper.toResponse(updatedUser);
    }

    async findById(userId: string){
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        return UserMapper.toResponse(user);
    }

    async getCurrentUser(user: JwtPayload) {
        return this.userRepository.findById(user.sub);
    }

    async deneme() {
        return this.currentUser();
    }

    async currentUser(){
        const payload = this.requestContext.user;

        if (!payload) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        const user = await this.userRepository.findById(payload.sub);

        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        return UserMapper.toResponse(user);
    }


}
