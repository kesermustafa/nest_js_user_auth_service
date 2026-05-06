import {IsEmail, IsString} from "class-validator";

export class UpdateMeDto {
    @IsString()
    @IsEmail({}, { message: 'Lütfen geçerli bir e-posta adresi giriniz.' })
    email?: string;
}