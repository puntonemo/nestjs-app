import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindProductDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: number;
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
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    partnerId: number;
    @IsOptional()
    schema: string;
    @IsOptional()
    count: 'exact' | 'planned' | 'estimated';
    @IsOptional()
    data: boolean;
}
