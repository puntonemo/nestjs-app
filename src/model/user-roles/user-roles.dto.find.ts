import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class FindUserRolDto {
    @IsOptional()
    @IsString()
    id: string;
    @IsOptional()
    code: string;
    @IsOptional()
    order: string;
    @IsOptional()
    ascending: boolean;
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page: number = 1;
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    pageSize: number = 10;
    @IsOptional()
    schema: string;
    @IsOptional()
    count: 'exact' | 'planned' | 'estimated';
    @IsOptional()
    data: boolean;
}
