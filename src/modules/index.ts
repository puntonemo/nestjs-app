import { AuthModule } from './auth/auth.module';
import { DefaultModule } from './default/default.module';
import { UsersModule } from './users/users.module';
import { CodeGeneratorModule } from './code-generator/code-generator.module';

export const Modules = [
    AuthModule,
    DefaultModule,
    UsersModule,
    CodeGeneratorModule
];
