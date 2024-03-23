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
import { UserRol, CreateUserRolDto, FindUserRolDto, UpdateUserRolDto } from '.';
import { User } from '@model/users';
import { MongoDBService } from '@lib/database';
import { ObjectId } from 'mongodb';

class UserRolAdapter {
    //* MONGODB REPOSITORY
    @Type(() => String)
    @Expose({ toPlainOnly: true, name: 'id' })
    _id?: any;
}
@Expose({ toClassOnly: true })
class CreateUserRolAdapter extends UserRolAdapter {
    //* MONGODB REPOSITORY
    @Exclude()
    id?: any;
}
const tableName = 'user-roles';

@Injectable()
export class UserRolesRepository {
    constructor(private readonly mongoDBService: MongoDBService) {}
    async create(createUserRolDto: CreateUserRolDto, user?: User) {
        const database = await this.mongoDBService.getDefaultDatabase();
        const newUserRol = {
            ...createUserRolDto,
            createdBy: user?.id,
            createdAt: new Date().toISOString()
        };

        const newUserRolAdated = this.adaptForCreate(newUserRol);

        try {
            const data = await database
                .collection(tableName)
                .insertOne(newUserRolAdated);

            newUserRolAdated._id = data.insertedId;

            return this.getInstance(this.adapt(newUserRolAdated), 'admin');
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async findAll(filters?: FindUserRolDto) {
        const database = await this.mongoDBService.getDefaultDatabase();
        // const page = filters?.page ?? 1;
        const pageSize = filters?.pageSize ?? 10;

        const pipeline = [];

        if (filters?.id)
            pipeline.push({ $match: { _id: new ObjectId(filters.id) } });

        if (filters?.order)
            pipeline['$sort'][filters?.order] = filters.ascending ? 1 : -1;

        pipeline.push({ $limit: pageSize });
        const data = await database
            .collection(tableName)
            .aggregate(pipeline)
            .toArray();

        return {
            data: this.getInstance(this.adapt(data), 'admin') ?? []
            //count: count ?? undefined
        };
    }
    async findOne(id: string) {
        const { data } = await this.findAll({ id } as FindUserRolDto);

        if (!data || (data as any[]).length < 1) throw new NotFoundException();

        return this.getInstance(this.adapt(data[0]), 'admin');
    }
    async update(id: string, updateUserRolDto: UpdateUserRolDto, user?: User) {
        const database = await this.mongoDBService.getDefaultDatabase();
        const existingUserRol = await this.findOne(id);

        if (!existingUserRol) throw new NotFoundException();

        const updateUserRol = {
            ...updateUserRolDto,
            updatedBy: user ? parseInt(user.id) : null,
            updatedAt: new Date().toISOString()
        };

        const adaptedUserRol = {
            ...this.adaptForCreate(existingUserRol),
            ...this.adaptForCreate(updateUserRol)
        };

        try {
            await database
                .collection(tableName)
                .updateOne({ _id: new ObjectId(id) }, { $set: adaptedUserRol });

            adaptedUserRol.id = id;

            return this.getInstance(this.adapt(adaptedUserRol), 'admin');
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
        instanceToPlain(plainToInstance(UserRolAdapter, data));

    private adaptForCreate = (data: any) =>
        plainToClass(CreateUserRolAdapter, data);

    private getInstance = (value: any, schemas?: string[] | string) =>
        plainToInstance(
            UserRol,
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
