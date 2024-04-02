import * as crypto from 'crypto';
import base64url from 'base64url';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { Buffer } from 'buffer';

/**
 * Returns base64url encoded buffer of the given length
 * @param  {Number} len - length of the buffer
 * @return {String}     - base64url random buffer
 */
export const randomBase64URLBuffer = (len: number) => {
    len = len || 32;

    const buff = crypto.randomBytes(len);

    return base64url(buff);
};
export const HASH_SALT = 'hashSalt';
const CRYPTO_ALGORITHM = 'aes-256-ctr';
const HASH_ALGORITHM = `sha512`;
const HASH_LENGTH = 64;
const HASH_ITERATIONS = 1000;

export const hashPassword = (
    password: string,
    passwordSalt: string
): string => {
    const passwordHash: string = crypto
        .pbkdf2Sync(
            password,
            passwordSalt,
            HASH_ITERATIONS,
            HASH_LENGTH,
            HASH_ALGORITHM
        )
        .toString(`hex`);
    return passwordHash;
};

//const ENCRYPTION_KEY = 'FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=' // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;

export function encrypt(text: string, password?: string) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(
            CRYPTO_ALGORITHM,
            Buffer.concat(
                [
                    Buffer.from(password || process.env.ENCRYPTION_KEY || ''),
                    Buffer.alloc(32)
                ],
                32
            ),
            iv
        );
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (ex) {
        console.log('encrypt failed: %o : %o', text, ex);
        return undefined;
    }
}

export function decrypt(text: string, password?: string) {
    try {
        const textParts = text.split(':');
        const textPartsShift = textParts.shift();
        if (textPartsShift) {
            const iv = Buffer.from(textPartsShift, 'hex');
            const encryptedText = Buffer.from(textParts.join(':'), 'hex');
            const decipher = crypto.createDecipheriv(
                CRYPTO_ALGORITHM,
                Buffer.concat(
                    [
                        Buffer.from(
                            password || process.env.ENCRYPTION_KEY || ''
                        ),
                        Buffer.alloc(32)
                    ],
                    32
                ),
                iv
            );
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } else {
            return undefined;
        }
    } catch {
        return undefined;
    }
}

/**
 * https://github.com/zacanger/shrink-string
 */
const gz = promisify(gzip);
const ugz = promisify(gunzip);

export const compress = async (s: string = ''): Promise<string> => {
    const compressed = await gz(s);
    return Buffer.from(compressed).toString('base64');
};

export const decompress = async (s: string = ''): Promise<string> => {
    const decompressed = await ugz(Buffer.from(Buffer.from(s, 'base64')));
    return decompressed.toString();
};

export const validateClientData = (
    credential: Record<string, any>,
    webauthFlowData: Record<string, any>,
    rpID: string
) => {
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
};
