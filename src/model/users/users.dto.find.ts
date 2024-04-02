import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional } from 'class-validator';

export class FindUserDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id?: string;
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    order?: string;
    @IsOptional()
    ascending?: boolean;
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page?: number = 1;
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    pageSize?: number = 10;
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    partnerId?: number;
    @IsOptional()
    googleid?: string;
    @IsOptional()
    liveid?: string;
    @IsOptional()
    schema?: string;
    @IsOptional()
    count?: 'exact' | 'planned' | 'estimated';
    @IsOptional()
    data?: boolean = true;
    @IsOptional()
    single?: boolean = false;
    @IsOptional()
    role?: string;
}
