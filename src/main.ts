import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const logger = new Logger('APP');
    const validationPipeOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
    };
    // const app = await NestFactory.create(AppModule, { rawBody: true });
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true
    });

    const configService = app.get<ConfigService>(ConfigService);
    const PORT = configService.get('PORT') || 3000;

    app.setBaseViewsDir(join(__dirname, '.', 'views'));
    // app.useStaticAssets(join(__dirname, '..', 'views/static'));
    app.use('/static', express.static(join(__dirname, '..', 'views/static')));
    app.setViewEngine('ejs');

    app.use(express.json({ limit: '60mb' }));

    app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

    if (configService.get('SWAGGER_PATH')) {
        const dbConfig = new DocumentBuilder()
            .addBearerAuth()
            .setTitle('Documentation')
            .setDescription('Project Documentation')
            .setVersion('1.0')
            .addTag('auth')
            .addTag('default')
            .addTag('products')
            .build();

        const document = SwaggerModule.createDocument(app, dbConfig);
        SwaggerModule.setup(configService.get('SWAGGER_PATH'), app, document);
    }

    await app.listen(PORT);
    logger.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
