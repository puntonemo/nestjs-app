import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@model/users';
import { UserRolesRepository } from '@model/user-rol/user-rol.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly userRolesRepository: UserRolesRepository,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: { id: string; email: string }) {
        //TODO: Allow a payload with full user information
        const user = await this.usersRepository.findByEmail(payload.email);
        if (!user) return undefined;
        const permissions = [];
        for (const rol of user.roles) {
            const rol_data = await this.userRolesRepository.findByCode(rol);
            if (Array.isArray(rol_data?.permissions))
                permissions.push(...rol_data.permissions);
        }
        const userPermissions = Array.from(new Set([...permissions]));
        user.permissions = userPermissions;
        return user;
    }
}
