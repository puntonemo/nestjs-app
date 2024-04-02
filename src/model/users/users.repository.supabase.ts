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
import { User, FindUserDto, CreateUserDto, UserDevice } from '.';
import { UpdateUserDto } from './users.dto.update';
import { SupabaseService } from '@lib/database';
import { IsOptional } from 'class-validator';

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

class RepositoryUpdateUserDto extends UpdateUserDto {
    @IsOptional()
    credentials?: any[];
    devices?: any[];
}

@Injectable()
export class UsersRepository {
    constructor(private readonly supabase: SupabaseService) {}
    async findByCredential(
        credentialId: string,
        schema = 'admin'
    ): Promise<User | undefined> {
        const query = this.supabase
            .getClient()
            .from(tableName)
            .select()
            .contains('credentials', [credentialId])
            .maybeSingle();

        const { data, error } = await query;

        if (error) throw new InternalServerErrorException(error);

        return this.getInstance(this.adapt(data), schema);
    }
    async addCredential(id: number, device: UserDevice) {
        const user = (await this.find({
            id: id.toString(),
            single: true
        })) as any;
        const credentials = user.credentials || [];
        const devices = user.devices || [];

        credentials.push(device.id);

        devices.push(device);

        this.update(parseInt(user.id), {
            credentials,
            devices
        });
    }
    async create(createUserDto: CreateUserDto, user?: User) {
        const newUser = {
            ...createUserDto,
            username: createUserDto.email,
            password: createUserDto.password
                ? User.hashPasword(createUserDto.email, createUserDto.password)
                : undefined,
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
    async find(filters?: FindUserDto, schema = 'admin') {
        const page = filters?.single ? 1 : filters?.page ?? 1;
        const pageSize = filters?.single ? 1 : filters?.pageSize ?? 10;
        const countOptions =
            filters?.count && !filters?.single
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
        if (filters?.googleid) {
            query.eq('googleid', filters.googleid);
        }
        if (filters?.liveid) {
            query.eq('liveid', filters.liveid);
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

        if (filters.single)
            return data.length > 0
                ? this.getInstance(this.adapt(data[0]), schema)
                : undefined;
        else
            return {
                data: this.getInstance(this.adapt(data), schema) ?? [],
                count: count ?? undefined
            };
    }

    async update(
        id: number,
        updateUserDto: RepositoryUpdateUserDto,
        user?: User
    ) {
        const existingUser = (await this.find({
            id: id.toString(),
            single: true
        })) as User;

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
