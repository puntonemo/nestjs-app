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
import { User, CreateUserDto, FindUserDto, UpdateUserDto } from '.';
import { MongoDBService } from '@lib/database';
import { ObjectId } from 'mongodb';

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
const tableName = 'users';

@Injectable()
export class UsersRepository {
    constructor(private readonly mongoDBService: MongoDBService) {}
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
    async findAll(filters?: FindUserDto, schema = 'admin') {
        const database = await this.mongoDBService.getDefaultDatabase();
        // const page = filters?.page ?? 1;
        const pageSize = filters?.pageSize ?? 10;

        const pipeline = [];

        if (filters?.id)
            pipeline.push({ $match: { _id: new ObjectId(filters.id) } });

        if (filters?.partnerId)
            pipeline.push({ $match: { partnerId: filters.partnerId } });

        if (filters?.email) pipeline.push({ $match: { email: filters.email } });

        if (filters?.order)
            pipeline['$sort'][filters?.order] = filters.ascending ? 1 : -1;

        pipeline.push({ $limit: pageSize });
        const data = await database
            .collection(tableName)
            .aggregate(pipeline)
            .toArray();

        return {
            data: this.getInstance(this.adapt(data), schema) ?? []
            //count: count ?? undefined
        };
    }
    async findOne(id: string) {
        const { data } = await this.findAll({ id } as FindUserDto);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return this.getInstance(this.adapt(data[0]), 'admin');
    }
    async findByEmail(email: string, schema = 'admin') {
        const { data } = await this.findAll({ email } as FindUserDto, schema);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return this.getInstance(this.adapt(data[0]), schema);
    }
    async update(id: string, updateUserDto: UpdateUserDto, user?: User) {
        const database = await this.mongoDBService.getDefaultDatabase();
        const existingUser = await this.findOne(id);

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
