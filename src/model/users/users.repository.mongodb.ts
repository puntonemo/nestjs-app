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
import { User, CreateUserDto, FindUserDto, UserDevice } from '.';
import { UpdateUserDto } from './users.dto.update';
import { MongoDBService } from '@lib/database';
import { ObjectId } from 'mongodb';
import { IsOptional } from 'class-validator';

class UserAdapter {
    //* MONGODB REPOSITORY
    @Type(() => String)
    @Expose({ toPlainOnly: true, name: 'id' })
    _id?: any;
}
@Expose({ toClassOnly: true })
class CreateUserAdapter extends UserAdapter {
    //* MONGODB REPOSITORY
    @Exclude()
    id?: any;
}
class RepositoryUpdateUserDto extends UpdateUserDto {
    @IsOptional()
    devices?: any[];
}
const tableName = 'users';

@Injectable()
export class UsersRepository {
    constructor(private readonly mongoDBService: MongoDBService) {}
    async findByCredential(
        credentialId: string,
        schema = 'admin'
    ): Promise<User | undefined> {
        const database = await this.mongoDBService.getDefaultDatabase();
        const data = await database
            .collection(tableName)
            .findOne({ 'devices.id': credentialId });
        return this.getInstance(this.adapt(data), schema);
    }
    async addCredential(id: string, device: UserDevice) {
        const user = (await this.find({
            id: id.toString(),
            single: true
        })) as any;

        const devices = user.devices || [];

        devices.push(device);

        this.update(user.id, {
            devices
        });
    }
    async create(createUserDto: CreateUserDto, user?: User) {
        const database = await this.mongoDBService.getDefaultDatabase();
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

        try {
            const data = await database
                .collection(tableName)
                .insertOne(newUserAdated);

            newUserAdated._id = data.insertedId;

            return this.getInstance(this.adapt(newUserAdated), 'admin');
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async find(filters?: FindUserDto, schema = 'admin') {
        const database = await this.mongoDBService.getDefaultDatabase();
        const page = filters?.single ? 1 : filters?.page ?? 1;
        const pageSize = filters?.single ? 1 : filters?.pageSize ?? 10;
        const skip = pageSize * (page - 1);
        if (!filters.data) filters.data = true;

        let count = 0;
        let data = undefined;
        const pipeline = [];
        const order = {};
        const match = {};

        if (filters?.id)
            pipeline.push({ $match: { _id: new ObjectId(filters.id) } });

        if (filters?.email) pipeline.push({ $match: { email: filters.email } });

        if (filters?.googleid)
            pipeline.push({ $match: { googleid: filters.googleid } });

        if (filters?.liveid)
            pipeline.push({ $match: { liveid: filters.liveid } });

        if (filters?.order)
            pipeline['$sort'][filters?.order] = filters.ascending ? 1 : -1;

        if (filters?.order) order[filters.order] = filters.ascending ? 1 : -1;

        if (Object.keys(match).length > 0) pipeline.push({ $match: match });
        if (Object.keys(order).length > 0) pipeline.push({ $sort: order });

        if (filters.count)
            count = (
                await database
                    .collection(tableName)
                    .aggregate([...pipeline, { $count: 'count' }])
                    .toArray()
            )[0].count;

        if (filters.data)
            data = await database
                .collection(tableName)
                .aggregate([...pipeline, { $skip: skip }, { $limit: pageSize }])
                .toArray();

        if (filters.single)
            return data?.length > 0
                ? this.getInstance(this.adapt(data[0]), schema)
                : undefined;
        else
            return {
                data: filters.data
                    ? this.getInstance(this.adapt(data), schema) ?? []
                    : undefined,
                count: filters.count ? count : undefined
            };
    }
    async update(
        id: string,
        updateUserDto: RepositoryUpdateUserDto,
        user?: User
    ) {
        const database = await this.mongoDBService.getDefaultDatabase();
        const existingUser = (await this.find({ id, single: true })) as User;

        if (!existingUser) throw new NotFoundException();

        const updateUser = {
            ...updateUserDto,
            updatedBy: user ? parseInt(user.id) : null,
            updatedAt: new Date().toISOString()
        };

        const adaptedUser = {
            ...this.adaptForCreate(existingUser),
            ...this.adaptForCreate(updateUser)
        };

        try {
            await database
                .collection(tableName)
                .updateOne({ _id: new ObjectId(id) }, { $set: adaptedUser });

            adaptedUser.id = id;

            return this.getInstance(this.adapt(adaptedUser), 'admin');
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async remove(id: string) {
        const database = await this.mongoDBService.getDefaultDatabase();
        try {
            await database
                .collection(tableName)
                .deleteOne({ _id: new ObjectId(id) });
            return { status: 'ok' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    //*******************************************************************/
    //*  G E N E R I C   R E P O S I T O R Y
    //*
    private adapt = (data: any) =>
        instanceToPlain(plainToInstance(UserAdapter, data));

    private adaptForCreate = (data: any) =>
        plainToClass(CreateUserAdapter, data);

    private getInstance = (value: any, schemas?: string[] | string) =>
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
