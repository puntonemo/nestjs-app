import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User, UsersRepository } from '@model/users';
import { SignUpDto } from './dto/signup.dto';
import { CreateUserDto } from '@model/users/users.dto.create';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly events: EventEmitter2
    ) {}
    async signin(signInDto: SignInDto) {
        const user: User = await this.usersRepository.findByEmail(
            signInDto.email,
            'auth'
        );

        if (!user) throw new UnauthorizedException();

        const hashedPassword = User.hashPasword(
            signInDto.email,
            signInDto.password
        );

        if (hashedPassword !== user.password) throw new UnauthorizedException();
        const signInMode = 'password';

        //TODO: Allow a payload with full user information
        const payload = {
            email: user.email,
            signInMode
        };

        const token = this.jwtService.sign(payload);

        this.events.emit('auth.signin', user.serialize());

        return {
            result: 'ok',
            token,
            user: user.serialize(),
            signInMode: 'passsword'
        };
    }
    async signup(signUpDto: SignUpDto) {
        const newUser: CreateUserDto = {
            email: signUpDto.email,
            firstname: signUpDto.firstname,
            lastname: signUpDto.lastname,
            password: signUpDto.password
        };
        const user = await this.usersRepository.create(newUser);
        const signInMode = 'signup';
        const payload = {
            email: user.email,
            signInMode
        };

        const token = this.jwtService.sign(payload);

        this.events.emit('auth.signup', user.serialize());

        return {
            result: 'ok',
            token,
            user: user.serialize(),
            signInMode
        };
    }
}
