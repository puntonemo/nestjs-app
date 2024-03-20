import { Injectable } from '@nestjs/common';
import {
    User,
    UsersRepository,
    FindUserDto,
    UpdateUserDto,
    CreateUserDto
} from '@model/users';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}
    create(createUserDto: CreateUserDto, user?: User) {
        return this.usersRepository.create(createUserDto, user);
    }

    findAll(filters: FindUserDto) {
        return this.usersRepository.findAll(filters);
    }

    findOne(id: number) {
        return this.usersRepository.findOne(id);
    }

    update(id: number, updateUserDto: UpdateUserDto, user?: User) {
        return this.usersRepository.update(id, updateUserDto, user);
    }

    remove(id: number) {
        return this.usersRepository.remove(id);
    }
}
