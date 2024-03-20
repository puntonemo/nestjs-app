import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@lib/auth/strategy/jws.strategy';
import { UsersRepository } from '@model/users';
import { UserRolesRepository } from '@model/user-roles';
import { DatabaseModule } from '@lib/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
import { GoogleStrategy } from '@lib/auth/strategy/google.strategy';
import { LiveController } from './live/live.controller';
import { LiveService } from './live/live.service';
import { LiveStrategy } from '@lib/auth/strategy/live.strategy';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN')
                    },
                    secret: configService.get('JWT_SECRET')
                };
            }
        })
    ],
    controllers: [AuthController, GoogleController, LiveController],
    providers: [
        AuthService,
        GoogleService,
        LiveService,
        JwtStrategy,
        GoogleStrategy,
        LiveStrategy,
        UsersRepository,
        UserRolesRepository
    ]
})
export class AuthModule {}
