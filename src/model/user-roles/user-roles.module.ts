import { Module } from '@nestjs/common';
import { UserRolesService } from '@model/user-roles/user-roles.admin.service';
import { UserRolesController } from '@model/user-roles/user-roles.admin.controller';
import { UserRolesRepository } from '@model/user-roles';
import { SupabaseService, MongoDBService } from '@lib/database';

@Module({
    controllers: [UserRolesController],
    providers: [
        UserRolesRepository,
        UserRolesService,
        SupabaseService,
        MongoDBService
    ]
})
export class UserRolesModule {}
