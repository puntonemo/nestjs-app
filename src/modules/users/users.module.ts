import { Module } from '@nestjs/common';
import { UsersService } from '@model/users/users.service';
import { UsersController } from '@model/users/users.controller';
import { UserRolesService } from '@model/user-roles/user-roles.service';
import { UserRolesController } from '@model/user-roles/user-roles.controller';
import { UsersRepository } from '@model/users';
import { UserRolesRepository } from '@model/user-roles';
import { DatabaseModule } from '@lib/database';
@Module({
    imports: [DatabaseModule],
    controllers: [UsersController, UserRolesController],
    providers: [
        UsersRepository,
        UserRolesRepository,
        UsersService,
        UserRolesService
    ]
})
export class UsersModule {}
