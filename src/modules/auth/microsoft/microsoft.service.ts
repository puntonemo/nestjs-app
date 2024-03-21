import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@model/users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MicrosoftService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService
    ) {}
    async liveLogin(req) {
        if (!req.user) {
            return 'No user from Microsoft';
        }

        // const user: User = await this.usersRepository.findByEmail(
        //     req.user.email,
        //     'auth'
        // );
        // console.log(user);
        const signInMode = 'microsoft';

        const payload = {
            email: req.user.email,
            signInMode
        };

        const token = this.jwtService.sign(payload);

        return {
            message: 'User information from Microsoft',
            user: req.user,
            token
        };
    }
}
