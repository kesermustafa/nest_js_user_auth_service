import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { MongooseUserRepository } from './infrastructure/persistence/mongoose-user.repository';
import { Users, UserSchema } from './infrastructure/persistence/schemas/user.schema';
import {SecurityModule} from "../../security/security.module";
import {RefreshToken, RefreshTokenSchema} from "./infrastructure/persistence/schemas/refresh-token.schema";
import {MongooseRefreshTokenRepository} from "./infrastructure/persistence/mongoose-refresh-token.repository";
import {RequestContext} from "./application/services/RequestContext";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Users.name, schema: UserSchema },
            { name: RefreshToken.name, schema: RefreshTokenSchema },
        ]),
        SecurityModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        RequestContext,

        {
            provide: 'IUserRepository',
            useClass: MongooseUserRepository
        },

        {
            provide: 'IRefreshTokenRepository',
            useClass: MongooseRefreshTokenRepository
        }
    ],
})
export class AuthModule {}