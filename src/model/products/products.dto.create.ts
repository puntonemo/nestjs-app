import { IsOptional } from 'class-validator';

export class CreateProductDto {
    @IsOptional()
    sku: string;
    @IsOptional()
    title: string;
    @IsOptional()
    description: string;
    @IsOptional()
    price: number;
}
