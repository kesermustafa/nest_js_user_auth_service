"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../domain/repositories/user-repository.interface");
const security_service_1 = require("../../../../security/security.service");
const user_mapper_1 = require("../mappers/user.mapper");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(userRepository, refreshTokenRepository, securityService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.securityService = securityService;
    }
    async register(dto) {
        const exists = await this.userRepository.findByEmail(dto.email);
        if (exists) {
            throw new common_1.ConflictException('Bu e-posta adresi zaten kullanımda');
        }
        const hashedPassword = await this.securityService.hashPassword(dto.password);
        const user = await this.userRepository.create({
            ...dto,
            password: hashedPassword
        });
        return user_mapper_1.UserMapper.toResponse(user);
    }
    async login(dto, response) {
        const user = await this.userRepository.findByEmail(dto.email);
        const isPasswordValid = user
            ? await this.securityService.comparePassword(dto.password, user.password)
            : false;
        if (!user || !isPasswordValid) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı');
        }
        const userId = user.id.toString();
        const jti = crypto.randomUUID();
        const payload = {
            sub: userId,
            email: user.email,
            role: user.role,
            jti: jti
        };
        await this.refreshTokenRepository.limitUserTokens(userId, 2);
        const accessToken = await this.securityService.generateToken(payload, '30m');
        const refreshToken = await this.securityService.generateToken(payload, '2d');
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
            user: user_mapper_1.UserMapper.toResponse(user)
        };
    }
    async refresh(oldRefreshToken, response) {
        if (!oldRefreshToken)
            throw new common_1.UnauthorizedException('Token bulunamadı');
        const payload = await this.securityService.verifyToken(oldRefreshToken);
        if (!payload || !payload.jti) {
            throw new common_1.UnauthorizedException('Geçersiz token');
        }
        const isTokenValid = await this.refreshTokenRepository.exists(payload.jti);
        if (!isTokenValid) {
            await this.refreshTokenRepository.deleteAllByUserId(payload.sub);
            throw new common_1.UnauthorizedException('Güvenlik ihlali tespit edildi! Lütfen tekrar giriş yapın.');
        }
        await this.refreshTokenRepository.deleteByJti(payload.jti);
        const newJti = crypto.randomUUID();
        const newPayload = {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
            jti: newJti
        };
        const newAccessToken = await this.securityService.generateToken(newPayload, '30m');
        const newRefreshToken = await this.securityService.generateToken(newPayload, '2d');
        const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        await this.refreshTokenRepository.create(payload.sub, newJti, expiresAt);
        response.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });
        return { access_token: newAccessToken };
    }
    async logout(token, response) {
        if (token) {
            const payload = await this.securityService.verifyToken(token);
            if (payload?.jti) {
                await this.refreshTokenRepository.deleteByJti(payload.jti);
            }
        }
        response.clearCookie('refresh_token');
        return { message: 'Başarıyla çıkış yapıldı' };
    }
    async updateProfile(userId, dto) {
        if (dto.email) {
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser && existingUser.id !== userId) {
                throw new common_1.ConflictException('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor');
            }
        }
        const updatedUser = await this.userRepository.update(userId, dto);
        if (!updatedUser) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return user_mapper_1.UserMapper.toResponse(updatedUser);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __param(1, (0, common_1.Inject)('IRefreshTokenRepository')),
    __metadata("design:paramtypes", [user_repository_interface_1.IUserRepository, Object, security_service_1.SecurityService])
], AuthService);
//# sourceMappingURL=auth.service.js.map