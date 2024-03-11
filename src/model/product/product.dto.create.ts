import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @IsOptional()
    @IsString()
    sku: string;
    @IsOptional()
    @IsString()
    title: string;
    @IsOptional()
    @IsString()
    description: string;
    @IsNumber()
    @IsOptional()
    price: number;
}
