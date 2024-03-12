import { InvocationContext, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createApp } from '../src/main.azure';

export default function (context: InvocationContext, req: HttpRequest): void {
    AzureHttpAdapter.handle(createApp, context, req);
}
