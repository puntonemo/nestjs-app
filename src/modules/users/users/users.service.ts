import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@model/user/dto/create-user.dto';
import { UpdateUserDto } from '@model/user/dto/update-user.dto';
import { User, UsersRepository } from '@model/user/user.model';
import { FindUserDto } from '@model/user/dto/find-user.dto';

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
