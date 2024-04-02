import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RemoteAddress = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return (
            request.headers['x-forwarded-for'] || request.socket.remoteAddress
        );
    }
);