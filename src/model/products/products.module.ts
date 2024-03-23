import { Module } from '@nestjs/common';
import { ProductsAdminService } from '@model/products/products.admin.service';
import { ProductsAdminController } from '@model/products/products.admin.controller';
import { ProductsRepository } from '@model/products';
import { MongoDBService } from '@lib/database';

@Module({
    controllers: [ProductsAdminController],
    providers: [ProductsAdminService, ProductsRepository, MongoDBService]
})
export class ProductsModule {}
