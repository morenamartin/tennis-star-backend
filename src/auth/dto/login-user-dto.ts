import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsBoolean()
    rememberMe!: boolean;
}