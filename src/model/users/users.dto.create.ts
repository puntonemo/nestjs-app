import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString
} from 'class-validator';

const DEFAULT_USER_ROLES = ['user'];

export class CreateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsString()
    firstname?: string;
    @IsString()
    lastname?: string;
    @IsString()
    password?: string;
    @IsOptional()
    picture?: string;
    @IsOptional()
    @IsArray()
    roles?: string[] = DEFAULT_USER_ROLES;
    @IsOptional()
    phone?: string;
    @IsOptional()
    @IsBoolean()
    active?: boolean = true;
    @IsOptional()
    liveid?: string;
    @IsOptional()
    googleid?: string;
}
