import { Module } from '@nestjs/common';
import { UsersAdminService } from '@model/users/users.admin.service';
import { UsersController } from '@model/users/users.admin.controller';
import { UsersRepository } from '@model/users';
import { SupabaseService, MongoDBService } from '@lib/database';
@Module({
    controllers: [UsersController],
    providers: [
        UsersRepository,
        UsersAdminService,
        SupabaseService,
        MongoDBService
    ]
})
export class UsersModule {}
