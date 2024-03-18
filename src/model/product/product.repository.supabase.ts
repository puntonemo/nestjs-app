import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {
    Exclude,
    Expose,
    Type,
    instanceToPlain,
    plainToClass,
    plainToInstance
} from 'class-transformer';
import { Product, CreateProductDto, FindProductDto, UpdateProductDto } from '.';
import { User } from '@model/users/users.entity';
import { SupabaseService } from '@lib/database';

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

const tableName = 'products';
const pkColumn = 'id';

@Injectable()
export class ProductsSupabaseRepository {
    constructor(private readonly supabase: SupabaseService) {}
    async create(createProductDto: CreateProductDto, user?: User) {
        const newProduct = {
            ...createProductDto,
            createdBy: user.id,
            createdAt: new Date().toISOString()
        };

        const newProductAdated = this.adaptForCreate(newProduct);

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .insert(newProductAdated)
            .select()
            .single();

        if (error) throw new InternalServerErrorException(error);

        return this.getInstance(this.adapt(data), 'admin');
    }
    async findAll(filters?: FindProductDto) {
        const page = filters?.page ?? 1;
        const pageSize = filters?.pageSize ?? 10;
        const countOptions = filters?.count
            ? {
                  count: filters.count,
                  head: filters.data ?? true ? false : true
              }
            : undefined;

        const select = ['*'];
        const query = this.supabase
            .getClient()
            .from(tableName)
            .select(select.join(','), countOptions);

        if (filters?.order)
            query.order(filters.order ?? pkColumn, {
                ascending: filters.ascending ?? true
            });
        if (filters?.id) {
            query.eq('id', filters.id);
        }

        query.range((page - 1) * pageSize, page * pageSize - 1);

        const { data, error, count } = await query;

        if (error) throw new InternalServerErrorException(error);

        return {
            data: this.getInstance(this.adapt(data), 'admin') ?? [],
            count: count ?? undefined
        };
    }
    async findOne(id: number) {
        const { data } = await this.findAll({ id } as FindProductDto);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return this.getInstance(this.adapt(data[0]), 'admin');
    }
    async update(id: number, updateProductDto: UpdateProductDto, user?: User) {
        const existingProduct = await this.findOne(id);

        if (!existingProduct) throw new NotFoundException();

        const updateProduct = {
            ...updateProductDto,
            updatedBy: user ? parseInt(user.id) : null,
            updatedAt: new Date().toISOString()
        };
        const userRolAdapted = {
            ...this.adaptForCreate(existingProduct),
            ...this.adaptForCreate(updateProduct)
        };

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .upsert(userRolAdapted)
            .select()
            .single();

        if (error) throw new InternalServerErrorException(error);

        return this.getInstance(this.adapt(data), 'admin');
    }
    async remove(id: number) {
        const { error } = await this.supabase
            .getClient()
            .from(tableName)
            .delete()
            .eq(pkColumn, id);

        if (error) throw new InternalServerErrorException(error);

        return { status: 'ok' };
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
