import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
    // constructor(private rol: string) {}
    constructor(private readonly reflector: Reflector) {}
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const allowedPermissions = this.reflector.getAllAndOverride(
            'permission',
            [context.getHandler(), context.getClass()]
        );

        if (!allowedPermissions) return true;

        const { permissions } = context.getArgByIndex(0).user!;

        if (!permissions) return false;

        if (Array.isArray(permissions) && permissions.includes('*'))
            return true;

        const isAllowed = permissions.some((permission: string) =>
            allowedPermissions.includes(permission)
        );

        return isAllowed;
    }
}
