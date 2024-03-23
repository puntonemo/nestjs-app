import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindProductDto {
    @IsOptional()
    @IsString()
    id: string;
    @IsOptional()
    @IsString()
    description: string;
    @IsOptional()
    @IsString()
    title: string;
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
