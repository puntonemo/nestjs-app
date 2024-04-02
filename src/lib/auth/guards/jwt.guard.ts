import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler()
        );

        const request = context.switchToHttp().getRequest() as Request;

        if (
            !request?.headers?.authorization &&
            !request?.cookies?.token &&
            !request.query.token &&
            isPublic
        )
            return true;

        return super.canActivate(context);
    }
}
