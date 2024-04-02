import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User, UserDevice, UsersRepository } from '@model/users';
import { SignUpDto } from './dto/signup.dto';
import { CreateUserDto } from '@model/users/users.dto.create';
import { randomBase64URLBuffer } from './utils';
import base64url from 'base64url';
import { UAParser } from 'ua-parser-js';
/**
 * RP ID represents the "scope" of websites on which a authenticator should be usable. The Origin
 * represents the expected URL from which registration or authentication occurs.
 */
export const rpID = 'http://localhost:4000';
const defaultRoles = ['user'];
@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly events: EventEmitter2
    ) {}
    async signin(signInDto: SignInDto) {
        const user: User = (await this.usersRepository.find(
            { email: signInDto.email, single: true },
            'auth'
        )) as User;

        if (!user) throw new UnauthorizedException();

        const hashedPassword = User.hashPasword(
            signInDto.email,
            signInDto.password
        );

        if (hashedPassword !== user.password) throw new UnauthorizedException();

        return this.getAuthResponse(user, 'password', 'auth.signin');
    }
    async signup(signUpDto: SignUpDto) {
        const newUser: CreateUserDto = {
            email: signUpDto.email,
            firstname: signUpDto.firstname,
            lastname: signUpDto.lastname,
            password: signUpDto.password,
            roles: defaultRoles
        };
        const user = await this.usersRepository.create(newUser);

        return this.getAuthResponse(user, 'signup', 'auth.signup');
    }
    async getChallenge(username: string, remoteAddress: string) {
        const user = username
            ? ((await this.usersRepository.find({
                  email: username,
                  single: true
              })) as User)
            : undefined;

        const challenge = randomBase64URLBuffer(32);

        const credentials =
            user && user.devices
                ? user.devices
                      .filter((i) => i.type == 'credential')
                      .map((i) => i.id)
                : undefined;
        const webauthFlowData = {
            challenge,
            rpID,
            username,
            firstname: user?.firstname,
            lastname: user?.lastname,
            userId: user?.id,
            credentials,
            remoteAddress: remoteAddress
        };

        return webauthFlowData;
    }
    async setCredential(
        credential: any,
        webauthFlowData: any,
        remoteAddress: string,
        reqHeaders: any
    ) {
        const { validated, clientDataObj } = this.validateClientData(
            credential,
            webauthFlowData
        );

        if (!validated) throw new UnauthorizedException();

        let user: User;

        const UAdeviceInfo = new UAParser(
            reqHeaders['user-agent'],
            reqHeaders
        ).getResult();

        switch (clientDataObj.type) {
            case 'webauthn.create':
                user = (await this.usersRepository.find({
                    email: credential.username,
                    single: true
                })) as User;

                const deviceInfo: UserDevice = {
                    type: 'credential',
                    ...credential.credential,
                    deviceInfo: UAdeviceInfo,
                    registeredAtRemoteAddress: remoteAddress,
                    registeredAt: Date.now().valueOf()
                };
                this.usersRepository.addCredential(user.id, deviceInfo);
                if (!user) throw new UnauthorizedException();

                break;
            case 'webauthn.get':
                user = await this.usersRepository.findByCredential(
                    credential.credentialId
                );
                if (!user)
                    throw new UnauthorizedException('Credential not found');

                return this.getAuthResponse(user, 'credential', 'auth.signin');
        }
    }
    async passportLogin(req, provider: 'google' | 'microsoft') {
        if (!req.user) {
            return `No user from ${provider}`;
        }

        //* Should it find users by googleid / liveid ?
        //? const findUserDto = { single: true };
        //? findUserDto[`${provider}id`] = req.user[`${provider}id`];

        let user: User = (await this.usersRepository.find({
            email: req.user.email,
            single: true
        })) as User;

        if (!user) {
            const newUser: CreateUserDto = {
                email: req.user.email,
                firstname: req.user.firstName,
                lastname: req.user.lastName,
                roles: defaultRoles
            };
            if (provider === 'microsoft') newUser.liveid = req.user.liveId;
            if (provider === 'google') newUser.googleid = req.user.googleId;

            user = await this.usersRepository.create(newUser);
        }
        // const user: User = await this.usersRepository.findByEmail(
        //     req.user.email,
        //     'auth'
        // );
        // console.log(user);
        return this.getAuthResponse(user, provider, 'auth.signin');
    }

    private validateClientData(
        credential: Record<string, any>,
        webauthFlowData: Record<string, any>
    ) {
        let validated = true;
        let clientDataObj;
        if (credential.clientData && webauthFlowData?.challenge) {
            const decodedClientData = base64url.decode(credential.clientData);
            clientDataObj = JSON.parse(decodedClientData);
            if (clientDataObj.challenge != webauthFlowData.challenge)
                validated = false;
            if (
                clientDataObj.type != 'webauthn.create' &&
                clientDataObj.type != 'webauthn.get'
            )
                validated = false;
            if (clientDataObj.origin != rpID) validated = false;
        } else {
            validated = false;
            clientDataObj = {};
        }

        return { validated, clientDataObj };
    }

    private getAuthResponse(
        user: User,
        signInMode:
            | 'signup'
            | 'password'
            | 'credential'
            | 'google'
            | 'microsoft',
        event: 'auth.signin' | 'auth.signup'
    ) {
        //TODO change email for username
        const payload = {
            email: user.email,
            signInMode
        };

        const token = this.jwtService.sign(payload);

        const authResponse = {
            result: 'ok',
            token,
            user: user.serialize(),
            signInMode,
            event
        };

        this.events.emit(event, authResponse);

        return authResponse;
    }
}
