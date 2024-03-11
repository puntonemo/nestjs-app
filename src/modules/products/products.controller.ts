import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
    // UseGuards
    // UseInterceptors
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from '@model/product';
import { User } from '@model/user/user.model';
import { AuthUser } from '@lib/auth/decorators/user.decorator';
// import { isPublic } from '@lib/auth/decorators/isPublic.decorator';
// import { Rol } from '@lib/auth/decorators/rol.decorator';
// import { JwtAuthGuard } from '@lib/auth/guards/jwt.guard';
// import { RolesGuard } from '@@lib/auth/guards/roles.guard';
// import { SchemaFromRol } from '@lib/core/interceptors/ClassSerializerSchema.decorators';
// import { ClassSerializerSchemaInterceptor } from '@lib/core/interceptors/ClassSerializerSchema';

@Controller('products')
// @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
// @UseInterceptors(ClassSerializerSchemaInterceptor)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto, @AuthUser() user: User) {
        return this.productsService.create(createProductDto, user);
    }

    @Get()
    //@isPublic()
    findAll(@Param('id') id: string, @AuthUser() user: User) {
        return this.productsService.findAll(
            user?.roles?.includes('admin') ? 'admin' : undefined
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @AuthUser() user: User
    ) {
        return this.productsService.update(+id, updateProductDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
