import { Module } from '@nestjs/common';
import { UserRolesService } from '@model/user-roles/user-roles.service';
import { UserRolesController } from '@model/user-roles/user-roles.controller';
import { UserRolesRepository } from '@model/user-roles';
import { SupabaseService } from '@lib/database';

@Module({
    controllers: [UserRolesController],
    providers: [UserRolesRepository, UserRolesService, SupabaseService]
})
export class UserRolesModule {}
