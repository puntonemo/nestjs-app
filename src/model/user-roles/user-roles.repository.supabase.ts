import { SupabaseService } from '@lib/database';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { UserRol } from '@model/user-roles/user-roles.entity';
import {
    Exclude,
    Expose,
    Type,
    instanceToPlain,
    plainToClass,
    plainToInstance
} from 'class-transformer';
import { UpdateUserRolDto } from './user-roles.dto.update';
import { FindUserRolDto } from './user-roles.dto.find';
import { CreateUserRolDto } from './user-roles.dto.create';
import { User } from '@model/users/users.entity';

class UserRolAdapter {
    @Expose({ toPlainOnly: true, name: 'byDefault' })
    bydefault?: boolean;
    @Expose({ toPlainOnly: true, name: 'createdAt' })
    created_at?: string;
    @Expose({ toPlainOnly: true, name: 'updatedAt' })
    updated_at?: string;
    @Expose({ toPlainOnly: true, name: 'updatedBy' })
    @Type(() => String)
    updated_by?: number;
}

@Expose({ toClassOnly: true })
class CreateUserRolAdapter extends UserRolAdapter {
    @Exclude()
    createdBy?: string;
}

const tableName = 'user_roles';
const pkColumn = 'id';

@Injectable()
export class UserRolesRepository {
    constructor(private readonly supabase: SupabaseService) {}
    async create(createUserRolDto: CreateUserRolDto, user?: User) {
        const newUserRol = {
            ...createUserRolDto,
            createdBy: user.id,
            createdAt: new Date().toISOString()
        };

        const newUserRolAdated = this.adaptForCreate(newUserRol);

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .insert(newUserRolAdated)
            .select()
            .single();

        if (error) throw new InternalServerErrorException(error);

        return UserRol.instance(this.adapt(data), 'admin');
    }
    async findAll(filters?: FindUserRolDto) {
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
        if (filters?.code) {
            query.eq('code', filters.code);
        }
        query.range((page - 1) * pageSize, page * pageSize - 1);

        const { data, error, count } = await query;

        if (error) throw new InternalServerErrorException(error);

        return {
            data: UserRol.instance(this.adapt(data), 'admin') ?? [],
            count: count ?? undefined
        };
    }
    async findByCode(code: string) {
        const { data } = await this.findAll({ code } as FindUserRolDto);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return UserRol.instance(this.adapt(data[0]), 'admin');
    }
    async findOne(id: string) {
        const { data } = await this.findAll({ id } as FindUserRolDto);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return UserRol.instance(this.adapt(data[0]), 'admin');
    }
    async update(id: string, updateUserRolDto: UpdateUserRolDto, user?: User) {
        const existingUserRol = await this.findOne(id);

        if (!existingUserRol) throw new NotFoundException();

        const updateUserRol = {
            ...updateUserRolDto,
            updatedBy: user ? parseInt(user.id) : null,
            updatedAt: new Date().toISOString()
        };
        const userRolAdapted = {
            ...this.adaptForCreate(existingUserRol),
            ...this.adaptForCreate(updateUserRol)
        };

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .upsert(userRolAdapted)
            .select()
            .single();

        if (error) throw new InternalServerErrorException(error);

        return UserRol.instance(this.adapt(data), 'admin');
    }
    async remove(id: string) {
        const { error } = await this.supabase
            .getClient()
            .from(tableName)
            .delete()
            .eq(pkColumn, parseInt(id));

        if (error) throw new InternalServerErrorException(error);

        return { status: 'ok' };
    }

    //*******************************************************************/
    //*  G E N E R I C   R E P O S I T O R Y
    //*
    private adapt(data: any) {
        return instanceToPlain(plainToInstance(UserRolAdapter, data));
    }
    private adaptForCreate(data: any) {
        return plainToClass(CreateUserRolAdapter, data);
    }
    //*
    //*********************************************************************/
}
