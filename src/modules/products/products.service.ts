import { Injectable } from '@nestjs/common';
import { User } from '@model/users/users.entity';
import {
    ProductsLocalRepository,
    CreateProductDto,
    UpdateProductDto
} from '@model/product';

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductsLocalRepository) {}
    create(createProductDto: CreateProductDto, user: User) {
        return this.productsRepository.create(createProductDto, user);
    }

    findAll(schema?: string) {
        return this.productsRepository.findAll(schema);
    }

    findOne(id: number) {
        return this.productsRepository.findOne(id);
    }

    update(id: number, updateProductDto: UpdateProductDto, user: User) {
        return this.productsRepository.update(id, updateProductDto, user);
    }

    remove(id: number) {
        return this.productsRepository.remove(id);
    }
}
