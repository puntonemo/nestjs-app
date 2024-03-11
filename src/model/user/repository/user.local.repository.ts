// import { Injectable } from '@nestjs/common';
import { User } from '@model/user/user.model';
import { plainToInstance } from 'class-transformer';

// @Injectable()
export class UsersRepository {
    private readonly users = [
        {
            id: 1,
            email: 'admin@test.com',
            firstname: 'admin',
            lastname: 'admin',
            password: 'asd23456',
            roles: ['user', 'admin']
        },
        {
            id: 2,
            email: 'john@test.com',
            firstname: 'john',
            lastname: 'changeme',
            password: 'asd23456',
            roles: ['user']
        },
        {
            id: 3,
            email: 'jane@test.com',
            firstname: 'jane',
            lastname: 'doe',
            password: 'asd23456',
            roles: ['user']
        }
    ];
    getByEmail(email: string): User | undefined {
        return this.getInstance(
            this.users.find((user) => user.email === email)
        );
    }
    getById(id: number): User | undefined {
        return this.getInstance(this.users.find((user) => user.id === id));
    }
    private getInstance = (value, schemas?: string[] | string) =>
        plainToInstance(
            User,
            value,
            schemas
                ? {
                    groups: typeof schemas == 'string' ? [schemas] : schemas
                }
                : undefined
        );
}
