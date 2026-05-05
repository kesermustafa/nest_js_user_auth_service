import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Geçersiz email formatı' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
    password: string;
}


export class LoginDto {
    @IsEmail({}, { message: 'Lütfen geçerli bir e-posta adresi giriniz.' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
    password: string;
}