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
import { Tag, CreateTagDto, FindTagDto, UpdateTagDto } from '.';
import { User } from '@model/users';
import { SupabaseService } from '@lib/database';

class TagAdapter {
    @Type(() => Number)
    id?: number;
}
@Expose({ toClassOnly: true })
class CreateTagAdapter extends TagAdapter {
    @Exclude()
    createdAt?: Date;
    @Exclude()
    createdBy?: string;
    @Exclude()
    updatedAt?: Date;
    @Exclude()
    updatedBy?: string;
}

const tableName = 'tags';
const pkColumn = 'id';

@Injectable()
export class TagsRepository {
    constructor(private readonly supabase: SupabaseService) {}
    async create(createTagDto: CreateTagDto, user?: User) {
        const newTag = {
            ...createTagDto,
            createdBy: user?.id,
            createdAt: new Date().toISOString()
        };

        const newTagAdated = this.adaptForCreate(newTag);

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .insert(newTagAdated)
            .select()
            .single();

        if (error) throw new InternalServerErrorException(error);

        return this.getInstance(this.adapt(data), 'admin');
    }
    async findAll(filters?: FindTagDto) {
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
        const { data } = await this.findAll({ id } as FindTagDto);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return this.getInstance(this.adapt(data[0]), 'admin');
    }
    async update(id: number, updateTagDto: UpdateTagDto, user?: User) {
        const existingTag = await this.findOne(id);

        if (!existingTag) throw new NotFoundException();

        const updateTag = {
            ...updateTagDto,
            updatedBy: user ? parseInt(user.id) : null,
            updatedAt: new Date().toISOString()
        };
        const adaptedTag = {
            ...this.adaptForCreate(existingTag),
            ...this.adaptForCreate(updateTag)
        };

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .upsert(adaptedTag)
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
        instanceToPlain(plainToInstance(TagAdapter, data));

    private adaptForCreate = (data: any) =>
        plainToClass(CreateTagAdapter, data);

    private getInstance = (value: any, schemas?: string[] | string) =>
        plainToInstance(
            Tag,
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
