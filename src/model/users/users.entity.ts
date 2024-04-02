import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import * as crypto from 'crypto';

const HASH_ALGORITHM = `sha512`;
const HASH_LENGTH = 64;
const HASH_ITERATIONS = 1000;

export class User {
    public readonly id?: string;
    public username: string;
    public firstname?: string;
    public lastname?: string;
    @Expose({ groups: ['auth'] })
    public password?: string;
    public picture?: string;
    @Expose({ groups: ['admin'] })
    public googleid?: string;
    @Expose({ groups: ['admin'] })
    public liveid?: string;
    @Expose({ groups: ['admin'] })
    public twitterid?: string;
    @Expose({ groups: ['admin'] })
    public devices?: any[] = [];
    @Expose({ groups: ['admin'] })
    public authenticators?: string[] = [];
    @Expose({ groups: ['admin'] })
    public certificates?: string[] = [];
    @Expose({ groups: ['admin', 'auth'] })
    public roles?: string[];
    @Expose({ groups: ['auth'] })
    public permissions?: string[];
    public email?: string;
    @Expose({ groups: ['admin'] })
    public emailConfirmedAt?: string;
    @Expose({ groups: ['admin'] })
    public emailConfirmationToken?: string;
    @Expose({ groups: ['admin'] })
    public emailConfirmationMessageId?: string;
    @Expose({ groups: ['admin'] })
    public emailChangedAt?: string;
    @Expose({ groups: ['admin'] })
    public emailChangeToken?: string | null;
    @Expose({ groups: ['admin'] })
    public emailChangeMessageId?: string;
    @Expose({ groups: ['admin'] })
    public phone?: string;
    @Expose({ groups: ['admin'] })
    public phoneConfirmedAt?: string;
    @Expose({ groups: ['admin'] })
    public phoneConfirmationToken?: string;
    @Expose({ groups: ['admin'] })
    public phoneConfirmationMessageId?: string;
    @Expose({ groups: ['admin'] })
    public phoneChangedAt?: string;
    @Expose({ groups: ['admin'] })
    public phoneChangeToken?: string;
    @Expose({ groups: ['admin'] })
    public phoneChangeMessageId?: string;
    @Expose({ groups: ['admin'] })
    public active?: boolean;
    @Expose({ groups: ['admin'] })
    public activeChangedAt?: string;
    @Expose({ groups: ['admin'] })
    public lastSignInAt?: string;
    @Expose({ groups: ['admin'] })
    public challenge?: object;
    @Expose({ groups: ['admin'] })
    public createdBy?: string;
    @Expose({ groups: ['admin'] })
    public createdAt?: string;
    @Expose({ groups: ['admin'] })
    public updatedAt?: string;
    @Expose({ groups: ['admin'] })
    public updatedBy?: number;
    @Expose({ groups: ['admin'] })
    public state: 'new' | 'exists';

    @Expose({ name: 'fullname' })
    fullname(): string {
        return `${this.firstname} ${this.lastname}`;
    }
    @Expose({ name: 'initials' })
    initials() {
        return `${this.firstname?.substring(0, 1).toUpperCase()}${this.lastname?.substring(0, 1).toUpperCase()}`;
    }
    static hashPasword(username: string, password: string) {
        const passwordHash: string = crypto
            .pbkdf2Sync(
                password,
                username,
                HASH_ITERATIONS,
                HASH_LENGTH,
                HASH_ALGORITHM
            )
            .toString(`hex`);
        return passwordHash;
    }
    hashPassword(password: string): string {
        return User.hashPasword(this.username, password);
    }
    //*******************************************************************/
    //*  G E N E R I C   M O D E L
    //*
    @Exclude() // * Important * //
    serialize = (schemas?: string[] | string) =>
        instanceToPlain(
            this,
            schemas
                ? { groups: typeof schemas === 'string' ? [schemas] : schemas }
                : undefined
        );
    //*
    //*********************************************************************/
}

export type UserDevice = {
    id: string;
    type: 'device' | 'credential' | 'key';
    algorithm?: string;
    deviceInfo?: any;
    publicKey?: string;
    registeredAtRemoteAddress?: number;
    registeredAt?: string;
};
