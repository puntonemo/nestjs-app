import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from '@lib/database';
import { Modules } from './modules';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { ClassSerializerSchemaInterceptor } from '@lib/core/interceptors/ClassSerializerSchema';
@Module({
    imports: [
        ...Modules,
        DatabaseModule,
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true
        })
    ],
    controllers: [],
    providers: [
        // ,{
        //     provide: APP_INTERCEPTOR,
        //     useClass: ClassSerializerSchemaInterceptor
        // }
    ]
})
export class AppModule {}
