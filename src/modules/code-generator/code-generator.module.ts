import { Module } from '@nestjs/common';
import { CodeGeneratorController } from './code-generator.controller';

@Module({
    controllers: [CodeGeneratorController]
})
export class CodeGeneratorModule {}
