import { AuthModule } from './auth/auth.module';
import { DefaultModule } from './default/default.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CodeGeneratorModule } from './code-generator/code-generator.module';
import { TagsModule } from './tags/tags.module';

export const Modules = [
    AuthModule,
    DefaultModule,
    ProductsModule,
    TagsModule,
    UsersModule,
    CodeGeneratorModule
];
