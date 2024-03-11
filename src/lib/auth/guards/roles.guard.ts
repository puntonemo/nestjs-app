import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    // constructor(private rol: string) {}
    constructor(private readonly reflector: Reflector) {}
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride('rol', [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles) return true;

        const { roles } = context.getArgByIndex(0).user!;

        if (!roles) return false;

        if (Array.isArray(roles) && roles.includes('*')) return true;

        const isAllowed = roles.some((rol: string) =>
            requiredRoles.includes(rol)
        );

        return isAllowed;
    }
}
