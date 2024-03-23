import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    Patch,
    Param,
    Delete
    // UseGuards
    // UseInterceptors
} from '@nestjs/common';
import { ProductsAdminService } from '@model/products/products.admin.service';
import {
    CreateProductDto,
    FindProductDto,
    UpdateProductDto
} from '@model/products';
import { User } from '@model/users';
import { AuthUser } from '@lib/auth/decorators/user.decorator';
// import { isPublic } from '@lib/auth/decorators/isPublic.decorator';
// import { Rol } from '@lib/auth/decorators/rol.decorator';
// import { JwtAuthGuard } from '@lib/auth/guards/jwt.guard';
// import { RolesGuard } from '@lib/auth/guards/roles.guard';
// import { SchemaFromRol } from '@lib/core/interceptors/ClassSerializerSchema.decorators';
// import { ClassSerializerSchemaInterceptor } from '@lib/core/interceptors/ClassSerializerSchema';

@Controller('products')
// @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
// @UseInterceptors(ClassSerializerSchemaInterceptor)
export class ProductsAdminController {
    constructor(private readonly productsAdminService: ProductsAdminService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto, @AuthUser() user: User) {
        return this.productsAdminService.create(createProductDto, user);
    }

    @Get()
    //@isPublic()
    findAll(@Query() filters: FindProductDto) {
        return this.productsAdminService.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsAdminService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @AuthUser() user: User
    ) {
        return this.productsAdminService.update(id, updateProductDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsAdminService.remove(id);
    }
}
