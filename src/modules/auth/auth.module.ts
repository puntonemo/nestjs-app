import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@lib/auth/strategy/jws.strategy';
import { UsersRepository } from '@model/user/user.model';
import { UserRolesRepository } from '@model/user-rol/user-rol.model';
import { DatabaseModule } from '@lib/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UsersRepository, UserRolesRepository]
})
export class AuthModule {}
