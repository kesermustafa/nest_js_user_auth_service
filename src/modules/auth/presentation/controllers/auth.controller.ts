import {Controller, Post, Body, Res, Req, UseGuards, Patch, SetMetadata} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto } from '../../application/dtos/auth.dto';
import { Response, Request } from 'express';
import {Role} from "../../domain/enums/role.enum";
import {RolesGuard} from "../../infrastructure/guards/roles.guard";
import {AuthGuard} from "../../infrastructure/guards/auth.guard";
import {CurrentUser} from "../../infrastructure/decorators/current-user.decorator";
import {UpdateMeDto} from "../../application/dtos/update-me.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(dto, response);
    }


    @Post('refresh')
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const token = request.cookies['refresh_token'];

        return this.authService.refresh(token, response);
    }

    @Post('admin-only')
    @SetMetadata('roles', [Role.ADMIN])
    @UseGuards(AuthGuard, RolesGuard)
    async adminTask() {
        return 'Bu gizli bir admin panelidir.';
    }

    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const token = request.cookies['refresh_token'];
        return this.authService.logout(token, response);

    }

    @Patch('update-me')
    @UseGuards(AuthGuard) // Guard mutlaka olmalı ki request.user dolsun
    async updateMe(
        @CurrentUser('sub') userId: string, // Guard'ın eklediği payload'dan sub'ı (id) alıyoruz
        @Body() dto: UpdateMeDto
    ) {
        return this.authService.updateProfile(userId, dto);
    }

}