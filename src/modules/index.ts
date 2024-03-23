import { AuthModule } from './auth/auth.module';
import { DefaultModule } from './default/default.module';
import { UsersModule } from '@model/users/users.module';
import { UserRolesModule } from '@model/user-roles/user-roles.module';
import { CodeGeneratorModule } from './code-generator/code-generator.module';
import { ProductsModule } from '@model/products/products.module';

export const Modules = [
    AuthModule,
    DefaultModule,
    UsersModule,
    UserRolesModule,
    ProductsModule,
    CodeGeneratorModule
];
