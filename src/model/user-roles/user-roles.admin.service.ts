import { Injectable } from '@nestjs/common';
import {
    FindUserRolDto,
    CreateUserRolDto,
    UpdateUserRolDto,
    UserRolesRepository
} from '@model/user-roles';
import { UserRolesRepository as UserRolesMongoRepository } from '@model/user-roles/user-roles.repository.mongodb';
import { User } from '@model/users';

@Injectable()
export class UserRolesService {
    constructor(
        private readonly userRolesRepository: UserRolesRepository,
        private readonly userRolesMongoRepository: UserRolesMongoRepository
    ) {}
    create(createUserRolDto: CreateUserRolDto, user?: User) {
        //return this.userRolesRepository.create(createUserRolDto, user);
        return this.userRolesMongoRepository.create(createUserRolDto, user);
    }

    findAll(filters: FindUserRolDto) {
        return this.userRolesRepository.findAll(filters);
    }

    findOne(id: string) {
        return this.userRolesRepository.findOne(id);
    }

    update(id: string, updateUserRolDto: UpdateUserRolDto, user?: User) {
        return this.userRolesRepository.update(id, updateUserRolDto, user);
    }

    remove(id: string) {
        return this.userRolesRepository.remove(id);
    }
}
