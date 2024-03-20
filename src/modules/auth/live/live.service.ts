import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@model/users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LiveService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService
    ) {}
    async liveLogin(req) {
        if (!req.user) {
            return 'No user from live';
        }

        // const user: User = await this.usersRepository.findByEmail(
        //     req.user.email,
        //     'auth'
        // );
        // console.log(user);
        const signInMode = 'live';

        const payload = {
            email: req.user.email,
            signInMode
        };

        const token = this.jwtService.sign(payload);

        return {
            message: 'User information from Microsoft Live',
            user: req.user,
            token
        };
    }
}
