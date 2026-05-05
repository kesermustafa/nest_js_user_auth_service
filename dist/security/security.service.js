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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const jose = require("jose");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let SecurityService = class SecurityService {
    constructor(configService) {
        this.configService = configService;
        const jwtSecret = this.configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET bulunamadı! Lütfen .env dosyasını kontrol edin.');
        }
        this.secret = new TextEncoder().encode(jwtSecret);
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async generateToken(payload, expiresIn) {
        const jwt = new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expiresIn);
        if (!payload.jti) {
            jwt.setJti(crypto.randomUUID());
        }
        return jwt.sign(this.secret);
    }
    async verifyToken(token) {
        try {
            const { payload } = await jose.jwtVerify(token, this.secret);
            return payload;
        }
        catch (error) {
            return null;
        }
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SecurityService);
//# sourceMappingURL=security.service.js.map