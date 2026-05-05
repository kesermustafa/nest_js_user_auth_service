import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { RefreshToken } from './schemas/refresh-token.schema';

@Injectable()
export class MongooseRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(
        @InjectModel(RefreshToken.name)
        private readonly refreshTokenModel: Model<RefreshToken>
    ) {}

    async create(userId: string, jti: string, expiresAt: Date): Promise<void> {
        await this.refreshTokenModel.create({
            userId,
            jti,
            expiresAt
        });
    }

    async exists(jti: string): Promise<boolean> {
        const token = await this.refreshTokenModel.findOne({
            jti,
            isRevoked: false
        }).exec();

        // Token varsa ve süresi dolmamışsa true döner
        return !!token && token.expiresAt > new Date();
    }

    async deleteByJti(jti: string): Promise<void> {
        await this.refreshTokenModel.deleteOne({ jti }).exec();
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        await this.refreshTokenModel.deleteMany({ userId }).exec();
    }

    async limitUserTokens(userId: string, limit: number): Promise<void> {
        // 1. Kullanıcının tüm tokenlarını yeniden eskiye (tarih sırasına) göre getir
        const tokens = await this.refreshTokenModel
            .find({ userId })
            .sort({ createdAt: -1 }) // En yeni en üstte
            .exec();

        // 2. Eğer mevcut token sayısı limitten fazlaysa, fazlalıkları sil
        if (tokens.length > limit) {
            // Limit içindeki en yeni tokenları koru, geri kalanların ID'lerini al
            const tokensToDelete = tokens.slice(limit); // Örneğin limit 2 ise, 2. indexten sonrasını al
            const idsToDelete = tokensToDelete.map(t => t._id);

            await this.refreshTokenModel.deleteMany({
                _id: { $in: idsToDelete }
            }).exec();
        }
    }
}