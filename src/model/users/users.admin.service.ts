import { Injectable } from '@nestjs/common';
import {
    User,
    UsersRepository,
    FindUserDto,
    UpdateUserDto,
    CreateUserDto
} from '@model/users';

@Injectable()
export class UsersAdminService {
    constructor(private readonly usersRepository: UsersRepository) {}
    create(createUserDto: CreateUserDto, user?: User) {
        return this.usersRepository.create(createUserDto, user);
    }

    findAll(filters: FindUserDto) {
        return this.usersRepository.find(filters);
    }

    findOne(id: string) {
        return this.usersRepository.find({ id, single: true });
    }

    update(id: string, updateUserDto: UpdateUserDto, user?: User) {
        return this.usersRepository.update(id, updateUserDto as User, user);
    }

    remove(id: string) {
        return this.usersRepository.remove(id);
    }
}
