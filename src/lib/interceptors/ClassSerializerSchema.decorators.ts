import { SetMetadata } from '@nestjs/common';

export const Schema = (...args: string[]) => SetMetadata('schema', args);
export const SchemaFromRol = () => SetMetadata('schemaFromRol', true);
export const NoSchema = () => SetMetadata('noSchema', true);
