import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {AuthModule} from "@auth/auth.module";


@Module({
    imports: [
        // .env dosyasını yükler ve global hale getirir
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Veritabanı bağlantısını asenkron olarak .env'den okuyarak yapar
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
        }),

        AuthModule,
    ],
})
export class AppModule {}