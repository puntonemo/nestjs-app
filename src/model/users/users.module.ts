import { Module } from '@nestjs/common';
import { UsersService } from '@model/users/users.service';
import { UsersController } from '@model/users/users.controller';
import { UsersRepository } from '@model/users';
import { SupabaseService } from '@lib/database';

@Module({
    controllers: [UsersController],
    providers: [UsersRepository, UsersService, SupabaseService]
})
export class UsersModule {}
