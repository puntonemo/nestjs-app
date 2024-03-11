import { Exclude, instanceToPlain, plainToInstance } from 'class-transformer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ModelSerialize<T> {
    @Exclude() // * Important * //
    serialize = (schemas?: string[] | string) =>
        instanceToPlain(
            this,
            schemas
                ? { groups: typeof schemas === 'string' ? [schemas] : schemas }
                : undefined
        );
}
export function Model<T>() {
    abstract class Resource extends ModelSerialize<T> {
        @Exclude()
        public static instance = (value, schemas?: string[] | string) =>
            plainToInstance(
                ModelSerialize<T>,
                value,
                schemas
                    ? {
                          groups:
                              typeof schemas == 'string' ? [schemas] : schemas
                      }
                    : undefined
            );
    }
    return Resource;
}
