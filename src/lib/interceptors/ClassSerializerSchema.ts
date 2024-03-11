import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class ClassSerializerSchemaInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const noSchema =
            this.reflector.get<string[]>('noSchema', context.getHandler()) ??
            false;

        if (noSchema) return next.handle();

        const schema =
            this.reflector.get<string[]>('schema', context.getHandler()) ?? [];

        const schemaFromRol =
            this.reflector.get<string[]>(
                'schemaFromRol',
                context.getHandler()
            ) ?? false;

        const roles = schemaFromRol
            ? this.reflector.get<string[]>('rol', context.getHandler()) ?? []
            : [];

        const schemas = Array.from(new Set([...schema, ...roles]));

        return next.handle().pipe(
            map((data) => {
                return instanceToPlain(data, { groups: schemas });
            })
        );
    }
}
