export interface IRefreshTokenRepository {
    create(userId: string, jti: string, expiresAt: Date): Promise<void>;
    exists(jti: string): Promise<boolean>;
    deleteByJti(jti: string): Promise<void>;
    deleteAllByUserId(userId: string): Promise<void>;
    limitUserTokens(userId: string, limit: number): Promise<void>;
}