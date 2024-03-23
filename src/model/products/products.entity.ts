import { Exclude, Expose, instanceToPlain } from 'class-transformer';

export class Product {
    //*******************************************************************/
    //* ATTRIBUTES
    @Expose({ groups: ['admin'] })
    public readonly id?: number;
    public sku?: string;
    public title?: string;
    public description?: string;
    public price?: number;
    @Expose({ groups: ['admin', 'audit'] })
    public createdAt?: Date;
    @Expose({ groups: ['admin', 'audit'] })
    public createdBy?: string;
    @Expose({ groups: ['admin', 'audit'] })
    public updatedAt?: Date;
    @Expose({ groups: ['admin', 'audit'] })
    public updatedBy?: string;

    //*******************************************************************/
    //* GENERIC MODEL
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
