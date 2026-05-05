import { Model } from 'mongoose';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { RefreshToken } from './schemas/refresh-token.schema';
export declare class MongooseRefreshTokenRepository implements IRefreshTokenRepository {
    private readonly refreshTokenModel;
    constructor(refreshTokenModel: Model<RefreshToken>);
    create(userId: string, jti: string, expiresAt: Date): Promise<void>;
    exists(jti: string): Promise<boolean>;
    deleteByJti(jti: string): Promise<void>;
    deleteAllByUserId(userId: string): Promise<void>;
    limitUserTokens(userId: string, limit: number): Promise<void>;
}
