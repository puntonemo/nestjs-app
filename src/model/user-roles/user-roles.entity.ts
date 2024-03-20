import {
    Exclude,
    Expose,
    instanceToPlain,
    plainToInstance
} from 'class-transformer';

export class UserRol {
    id?: string;
    code?: string;
    description?: string;
    permissions?: string[];
    byDefault?: boolean = false;
    @Expose({ groups: ['admin'] })
    createdAt?: Date = new Date();
    @Expose({ groups: ['admin'] })
    createdBy?: string;
    @Expose({ groups: ['admin'] })
    updatedAt?: Date;
    @Expose({ groups: ['admin'] })
    updatedBy?: string;
    //*******************************************************************/
    //*  G E N E R I C   M O D E L
    //*
    @Exclude()
    static instance = (value, schemas?: string[] | string) =>
        plainToInstance(
            UserRol,
            value,
            schemas
                ? {
                      groups: typeof schemas == 'string' ? [schemas] : schemas
                  }
                : undefined
        );
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
