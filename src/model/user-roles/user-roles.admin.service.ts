import { Injectable } from '@nestjs/common';
import {
    FindUserRolDto,
    CreateUserRolDto,
    UpdateUserRolDto,
    UserRolesRepository
} from '@model/user-roles';
import { User } from '@model/users';

@Injectable()
export class UserRolesService {
    constructor(private readonly userRolesRepository: UserRolesRepository) {}
    create(createUserRolDto: CreateUserRolDto, user?: User) {
        return this.userRolesRepository.create(createUserRolDto, user);
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
