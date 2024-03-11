import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsLocalRepository } from '@model/product';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService, ProductsLocalRepository]
})
export class ProductsModule {}
