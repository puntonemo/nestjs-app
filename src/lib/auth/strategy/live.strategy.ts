import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-windowslive';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LiveStrategy extends PassportStrategy(Strategy, 'windowslive') {
    constructor(private readonly config: ConfigService) {
        super({
            clientID: config.get('LIVE_CLIENT_ID'),
            clientSecret: config.get('LIVE_CLIENT_SECRET'),
            callbackURL: config.get('LIVE_CALLBACK_URL'),
            scope: ['wl.signin', 'wl.basic', 'wl.emails'] // ['openid', 'profile', 'email', 'User.Read'] //['wl.signin', 'wl.basic']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        };
        done(null, user);
    }
}
