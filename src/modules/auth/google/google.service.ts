import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@model/users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService
    ) {}
    async googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }

        // const user: User = await this.usersRepository.findByEmail(
        //     req.user.email,
        //     'auth'
        // );
        // console.log(user);
        const signInMode = 'google';

        const payload = {
            email: req.user.email,
            signInMode
        };

        const token = this.jwtService.sign(payload);

        return {
            message: 'User information from google',
            user: req.user,
            token
        };
    }
}
