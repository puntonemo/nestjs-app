import {
    Exclude,
    Expose,
    Type,
    instanceToPlain,
    plainToClass,
    plainToInstance
} from 'class-transformer';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { User, FindUserDto, CreateUserDto, UpdateUserDto } from '.';
import { SupabaseService } from '@lib/database';

const tableName = 'users';
const pkColumn = 'id';

class UserAdapter {
    @Type(() => String)
    id?: string;
    @Expose({ toPlainOnly: true, name: 'emailConfirmedAt' })
    email_confirmed_at: string;
    @Expose({ toPlainOnly: true, name: 'emailConfirmationToken' })
    email_confirmation_token?: string;
    @Expose({ toPlainOnly: true, name: 'partnerId' })
    partner_id?: number;
    @Expose({ toPlainOnly: true, name: 'emailConfirmationMessageId' })
    email_confirmation_messageid?: string;
    @Expose({ toPlainOnly: true, name: 'emailChangedAt' })
    email_changed_at?: string;
    @Expose({ toPlainOnly: true, name: 'emailChangeToken' })
    email_change_token?: string | null;
    @Expose({ toPlainOnly: true, name: 'emailChangeMessageId' })
    email_change_messageid?: string;
    @Expose({ toPlainOnly: true, name: 'phoneConfirmedAt' })
    phone_confirmed_at?: string;
    @Expose({ toPlainOnly: true, name: 'phoneConfirmationToken' })
    phone_confirmation_token?: string;
    @Expose({ toPlainOnly: true, name: 'phoneConfirmationMessageId' })
    phone_confirmation_messageid?: string;
    @Expose({ toPlainOnly: true, name: 'phoneChangedAt' })
    phone_changed_at?: string;
    @Expose({ toPlainOnly: true, name: 'phoneChangeToken' })
    phone_change_token?: string;
    @Expose({ toPlainOnly: true, name: 'phoneChangeMessageId' })
    phone_change_messageid?: string;
    @Expose({ toPlainOnly: true, name: 'activeChangedAt' })
    active_changed_at?: string;
    @Expose({ toPlainOnly: true, name: 'lastSignInAt' })
    last_sign_in_at?: string;
    @Expose({ toPlainOnly: true, name: 'createdAt' })
    created_at?: string;
    @Expose({ toPlainOnly: true, name: 'updatedAt' })
    updated_at?: string;
    @Expose({ toPlainOnly: true, name: 'updatedBy' })
    @Type(() => String)
    updated_by?: number;
}
@Expose({ toClassOnly: true })
class CreateUserAdapter extends UserAdapter {
    @Exclude()
    createdBy?: string;
}

@Injectable()
export class UsersRepository {
    constructor(private readonly supabase: SupabaseService) {}
    async findByEmail(email: string, schema = 'admin') {
        const { data } = await this.findAll({ email } as FindUserDto, schema);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return this.getInstance(this.adapt(data[0]), schema);
    }
    async create(createUserDto: CreateUserDto, user?: User) {
        const newUser = {
            ...createUserDto,
            username: createUserDto.email,
            password: User.hashPasword(
                createUserDto.email,
                createUserDto.password
            ),
            createdBy: user?.id,
            createdAt: new Date().toISOString()
        };

        const newUserAdated = this.adaptForCreate(newUser);

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .insert(newUserAdated)
            .select()
            .single();

        if (error) throw new InternalServerErrorException(error);

        return this.getInstance(this.adapt(data), 'admin');
    }
    async findAll(filters?: FindUserDto, schema = 'admin') {
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
        if (filters?.role) query.contains('roles', [filters.role]);

        if (filters?.partnerId) {
            query.eq('partner_id', filters.partnerId);
        }
        if (filters?.id) {
            query.eq('id', filters.id);
        }
        if (filters?.email) {
            query.eq('email', filters.email);
        }
        query.range((page - 1) * pageSize, page * pageSize - 1);

        const { data, error, count } = await query;

        if (error) throw new InternalServerErrorException(error);

        return {
            data: this.getInstance(this.adapt(data), schema) ?? [],
            count: count ?? undefined
        };
    }
    async findOne(id: number, schema = 'admin') {
        const { data } = await this.findAll({ id } as FindUserDto);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return this.getInstance(this.adapt(data[0]), schema);
    }
    async update(id: number, updateUserDto: UpdateUserDto, user?: User) {
        const existingUser = await this.findOne(id);

        if (!existingUser) throw new NotFoundException();

        const updateUser = {
            ...updateUserDto,
            updatedBy: user ? parseInt(user.id) : null,
            updatedAt: new Date().toISOString()
        };
        const userAdapted = {
            ...this.adaptForCreate(existingUser),
            ...this.adaptForCreate(updateUser)
        };

        const { data, error } = await this.supabase
            .getClient()
            .from(tableName)
            .upsert(userAdapted)
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
    private adapt(data: any) {
        return instanceToPlain(plainToInstance(UserAdapter, data));
    }
    private adaptForCreate(data: any) {
        return plainToClass(CreateUserAdapter, data);
    }
    private getInstance = (value, schemas?: string[] | string) =>
        plainToInstance(
            User,
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
