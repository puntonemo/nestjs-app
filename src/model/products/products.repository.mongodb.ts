// import {
//     Injectable,
//     InternalServerErrorException,
//     NotFoundException
// } from '@nestjs/common';
// import {
//     Exclude,
//     Expose,
//     Type,
//     instanceToPlain,
//     plainToClass,
//     plainToInstance
// } from 'class-transformer';
// import { Product, CreateProductDto, FindProductDto, UpdateProductDto } from '.';
// import { User } from '@model/users';
// import { MongoDBService } from '@lib/database';
// import { ObjectId } from 'mongodb';

// class ProductAdapter {
//     //* MONGODB REPOSITORY
//     @Type(() => String)
//     @Expose({ toPlainOnly: true, name: 'id' })
//     _id?: any;
// }
// @Expose({ toClassOnly: true })
// class CreateProductAdapter extends ProductAdapter {
//     //* MONGODB REPOSITORY
//     @Exclude()
//     id?: any;
// }
// const tableName = 'products';

// @Injectable()
// export class ProductsRepository {
//     constructor(private readonly mongoDBService: MongoDBService) {}
//     async create(createProductDto: CreateProductDto, user?: User) {
//         const database = await this.mongoDBService.getDefaultDatabase();
//         const newProduct = {
//             ...createProductDto,
//             createdBy: user?.id,
//             createdAt: new Date().toISOString()
//         };

//         const newProductAdated = this.adaptForCreate(newProduct);

//         try {
//             const data = await database
//                 .collection(tableName)
//                 .insertOne(newProductAdated);

//             newProductAdated._id = data.insertedId;

//             return this.getInstance(this.adapt(newProductAdated), 'admin');
//         } catch (error) {
//             throw new InternalServerErrorException(error);
//         }
//     }
//     async findAll(filters?: FindProductDto) {
//         const database = await this.mongoDBService.getDefaultDatabase();
//         // const page = filters?.page ?? 1;
//         const pageSize = filters?.pageSize ?? 10;

//         const pipeline = [];

//         if (filters?.id)
//             pipeline.push({ $match: { _id: new ObjectId(filters.id) } });

//         if (filters?.description)
//             pipeline.push({
//                 $match: { description: new RegExp(filters.description, 'i') }
//             });

//         if (filters?.title)
//             pipeline.push({
//                 $match: { title: new RegExp(filters.title, 'i') }
//             });

//         if (filters?.order)
//             pipeline['$sort'][filters?.order] = filters.ascending ? 1 : -1;

//         pipeline.push({ $limit: pageSize });
//         const data = await database
//             .collection(tableName)
//             .aggregate(pipeline)
//             .toArray();

//         return {
//             data: this.getInstance(this.adapt(data), 'admin') ?? []
//             //count: count ?? undefined
//         };
//     }
//     async findOne(id: string) {
//         const { data } = await this.findAll({ id } as FindProductDto);

//         if (!data || (data as any[]).length < 1) throw new NotFoundException();

//         return this.getInstance(this.adapt(data[0]), 'admin');
//     }
//     async update(id: string, updateProductDto: UpdateProductDto, user?: User) {
//         const database = await this.mongoDBService.getDefaultDatabase();
//         const existingProduct = await this.findOne(id);

//         if (!existingProduct) throw new NotFoundException();

//         const updateProduct = {
//             ...updateProductDto,
//             updatedBy: user ? parseInt(user.id) : null,
//             updatedAt: new Date().toISOString()
//         };

//         const adaptedProduct = {
//             ...this.adaptForCreate(existingProduct),
//             ...this.adaptForCreate(updateProduct)
//         };

//         try {
//             await database
//                 .collection(tableName)
//                 .updateOne({ _id: new ObjectId(id) }, { $set: adaptedProduct });

//             adaptedProduct.id = id;

//             return this.getInstance(this.adapt(adaptedProduct), 'admin');
//         } catch (error) {
//             throw new InternalServerErrorException(error);
//         }
//     }
//     async remove(id: string) {
//         const database = await this.mongoDBService.getDefaultDatabase();
//         try {
//             await database
//                 .collection(tableName)
//                 .deleteOne({ _id: new ObjectId(id) });
//             return { status: 'ok' };
//         } catch (error) {
//             throw new InternalServerErrorException(error);
//         }
//     }
//     //*******************************************************************/
//     //*  G E N E R I C   R E P O S I T O R Y
//     //*
//     private adapt = (data: any) =>
//         instanceToPlain(plainToInstance(ProductAdapter, data));

//     private adaptForCreate = (data: any) =>
//         plainToClass(CreateProductAdapter, data);

//     private getInstance = (value: any, schemas?: string[] | string) =>
//         plainToInstance(
//             Product,
//             value,
//             schemas
//                 ? {
//                       groups: typeof schemas == 'string' ? [schemas] : schemas
//                   }
//                 : undefined
//         );
//     //*
//     //*********************************************************************/
// }
