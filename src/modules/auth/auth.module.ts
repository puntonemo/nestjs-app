import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/modules/auth/strategies/jws.strategy';
import { UsersRepository } from '@model/users';
import { UserRolesRepository } from '@model/user-roles';
import { DatabaseModule } from '@lib/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
import { GoogleStrategy } from 'src/modules/auth/strategies/google.strategy';
import { MicrosoftController } from './microsoft/microsoft.controller';
import { MicrosoftService } from './microsoft/microsoft.service';
import { MicrosoftStrategy } from 'src/modules/auth/strategies/microsoft.strategy';

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
    controllers: [AuthController, GoogleController, MicrosoftController],
    providers: [
        AuthService,
        GoogleService,
        MicrosoftService,
        JwtStrategy,
        GoogleStrategy,
        MicrosoftStrategy,
        UsersRepository,
        UserRolesRepository
    ]
})
export class AuthModule {}
