import { Injectable } from '@nestjs/common';
import { FindUserRolDto } from '@model/user-rol/dto/find-user-rol.dto';
import { CreateUserRolDto } from '@model/user-rol/dto/create-user-rol.dto';
import { UpdateUserRolDto } from '@model/user-rol/dto/update-user-rol.dto';
import { UserRolesRepository } from '@model/user-rol/user-rol.model';
import { User } from '@model/user/user.model';

@Injectable()
export class UserRolesService {
    constructor(private readonly userRolesRepository: UserRolesRepository) {}
    create(createUserRolDto: CreateUserRolDto, user?: User) {
        return this.userRolesRepository.create(createUserRolDto, user);
    }

    findAll(filters: FindUserRolDto) {
        return this.userRolesRepository.findAll(filters);
    }

    findOne(id: number) {
        return this.userRolesRepository.findOne(id);
    }

    update(id: number, updateUserRolDto: UpdateUserRolDto, user?: User) {
        return this.userRolesRepository.update(id, updateUserRolDto, user);
    }

    remove(id: number) {
        return this.userRolesRepository.remove(id);
    }
}
