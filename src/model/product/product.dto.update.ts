import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './product.dto.create';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
