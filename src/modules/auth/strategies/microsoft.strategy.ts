import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-microsoft';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
    constructor(private readonly config: ConfigService) {
        super({
            clientID: config.get('MICROSOFT_CLIENT_ID'),
            clientSecret: config.get('MICROSOFT_CLIENT_SECRET'),
            callbackURL: config.get('MICROSOFT_CALLBACK_URL'),
            scope: ['openid', 'profile', 'email', 'User.Read']
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
            email: emails?.length > 0 ? emails[0]?.value : undefined,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos?.length > 0 ? photos[0].value : undefined,
            accessToken
        };
        done(null, user);
    }
}
