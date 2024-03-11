import {
    Injectable
    // InternalServerErrorException,
    // NotFoundException
} from '@nestjs/common';
import {
    Exclude,
    Expose,
    Type,
    instanceToPlain,
    plainToClass,
    plainToInstance
} from 'class-transformer';
import { Product, CreateProductDto, UpdateProductDto } from '.';
import { User } from '@model/user/user.model';

class ProductAdapter {
    @Type(() => String)
    id?: string;
    @Expose({ toPlainOnly: true, name: 'createdAt' })
    created_at?: Date;
    @Type(() => String)
    @Expose({ toPlainOnly: true, name: 'createdBy' })
    created_by?: string;
    @Expose({ toPlainOnly: true, name: 'updatedAt' })
    updated_at?: Date;
}
@Expose({ toClassOnly: true })
class CreateProductAdapter extends ProductAdapter {
    @Exclude()
    updatedBy?: string;
}

@Injectable()
export class ProductsLocalRepository {
    private products: Record<string, any> = [];
    async findOne(
        id: number,
        schemas?: string | string[]
    ): Promise<Product | undefined> {
        return this.getInstance(
            this.adapt(this.products.find((item) => item.id === id)),
            schemas
        );
    }
    async findAll(schemas?: string | string[]) {
        return this.getInstance(this.adapt(this.products), schemas);
    }
    async create(
        createProductDto: CreateProductDto,
        user?: User,
        schemas: string | string[] = ['admin']
    ) {
        const newProduct = this.getInstance(
            this.adapt({
                ...createProductDto,
                id: Object.entries(this.products).length + 1,
                createdAt: new Date(),
                createdBy: user?.id
            }),
            schemas
        );

        this.products.push(this.adaptForCreate(newProduct));

        return newProduct;
    }
    async update(
        id: number,
        updateProductDto: UpdateProductDto,
        user?: User,
        schemas: string | string[] = ['admin']
    ) {
        const index = Object.entries(this.products).findIndex(
            (i: any) => parseInt(i[1].id) === id
        );
        if (index >= 0) {
            const updatedProduct = {
                ...this.adapt(this.products[index]),
                ...updateProductDto,
                updatedAt: new Date(),
                updatedBy: user?.id
            };
            this.products[index] = this.adaptForCreate(updatedProduct);

            return this.getInstance(updatedProduct, schemas);
        }
    }
    async remove(id: number) {
        const index = Object.entries(this.products).findIndex(
            (i: any) => i[1].id === id
        );
        if (index >= 0) {
            this.products.splice(index, 1);
        }
    }
    //*******************************************************************/
    //*  G E N E R I C   R E P O S I T O R Y
    //*
    private adapt = (data: any) =>
        instanceToPlain(plainToInstance(ProductAdapter, data));

    private adaptForCreate = (data: any) =>
        plainToClass(CreateProductAdapter, data);

    private getInstance = (value, schemas?: string[] | string) =>
        plainToInstance(
            Product,
            value,
            schemas
                ? {
                      groups: typeof schemas == 'string' ? [schemas] : schemas
                  }
                : undefined
        );

    //*
    //*********************************************************************/
}
