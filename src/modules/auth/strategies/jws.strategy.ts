import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User, UsersRepository } from '@model/users';
import { UserRolesRepository } from '@model/user-roles';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly userRolesRepository: UserRolesRepository,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: { id: string; email: string }) {
        //TODO: Allow a payload with full user information
        const user = (await this.usersRepository.find({
            email: payload.email,
            single: true
        })) as User;
        if (!user) return undefined;
        const permissions = [];
        for (const rol of user.roles || []) {
            const rol_data = await this.userRolesRepository.findByCode(rol);
            if (Array.isArray(rol_data?.permissions))
                permissions.push(...rol_data.permissions);
        }
        const userPermissions = Array.from(new Set([...permissions]));
        user.permissions = userPermissions;
        return user;
    }
    private static extractJWT(req: RequestType): string | null {
        if (req.cookies?.token) {
            return req.cookies.token;
        }
        if (req.query?.token) {
            return req.query.token as string;
        }
        return null;
    }
}
