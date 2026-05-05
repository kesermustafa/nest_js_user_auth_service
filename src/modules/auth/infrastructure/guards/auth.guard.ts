import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { SecurityService } from '../../../../security/security.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly securityService: SecurityService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // 1. Header'dan Bearer token'ı al
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Erişim yetkiniz yok (Token bulunamadı)');
        }

        const token = authHeader.split(' ')[1];

        try {
            // 2. Token'ı SecurityService üzerinden doğrula
            const payload = await this.securityService.verifyToken(token);

            if (!payload) {
                throw new UnauthorizedException('Geçersiz veya süresi dolmuş token');
            }

            // 3. Kullanıcı bilgisini request nesnesine ekle
            // Böylece Controller'da @Req() request üzerinden kullanıcıya erişebiliriz
            request.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException('Yetkilendirme hatası');
        }
    }
}