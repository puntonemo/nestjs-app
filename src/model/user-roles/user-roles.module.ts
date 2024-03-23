import { Module } from '@nestjs/common';
import { UserRolesService } from '@model/user-roles/user-roles.admin.service';
import { UserRolesController } from '@model/user-roles/user-roles.admin.controller';
import { UserRolesRepository } from '@model/user-roles';
import { UserRolesRepository as UserRolesMongoRepository } from '@model/user-roles/user-roles.repository.mongodb';
import { SupabaseService, MongoDBService } from '@lib/database';

@Module({
    controllers: [UserRolesController],
    providers: [
        UserRolesRepository,
        UserRolesMongoRepository,
        UserRolesService,
        SupabaseService,
        MongoDBService
    ]
})
export class UserRolesModule {}
