import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    firstname: string;
    @IsString()
    @MinLength(1)
    @MaxLength(25)
    lastname: string;
    @IsString()
    @MinLength(6)
    @MaxLength(25)
    password: string;
}
