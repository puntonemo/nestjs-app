import { Injectable } from '@nestjs/common';
import { User } from '@model/users';
import {
    ProductsRepository,
    CreateProductDto,
    FindProductDto,
    UpdateProductDto
} from '@model/products';

@Injectable()
export class ProductsAdminService {
    constructor(private readonly productsRepository: ProductsRepository) {}
    create(createProductDto: CreateProductDto, user: User) {
        return this.productsRepository.create(createProductDto, user);
    }

    findAll(filters: FindProductDto) {
        return this.productsRepository.findAll(filters);
    }

    findOne(id: string) {
        return this.productsRepository.findOne(id);
    }

    update(id: string, updateProductDto: UpdateProductDto, user: User) {
        return this.productsRepository.update(id, updateProductDto, user);
    }

    remove(id: string) {
        return this.productsRepository.remove(id);
    }
}
