import { Transform } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstname: string;
    @IsOptional()
    @IsString()
    lastname: string;
    @IsOptional()
    picture: string;
    @IsOptional()
    @IsArray()
    roles: string[];
    @IsOptional()
    phone: string;
    @IsOptional()
    @IsBoolean()
    active: boolean = true;
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    partnerId: number;
}
