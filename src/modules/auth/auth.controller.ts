import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    Schema
    // SchemaFromRol,
} from '@lib/interceptors/ClassSerializerSchema.decorators';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from '@lib/auth/guards/jwt.guard';
import { AuthUser } from '@lib/auth/decorators/user.decorator';
import { User } from '@model/user/user.model';
import { ClassSerializerSchemaInterceptor } from '@lib/interceptors/ClassSerializerSchema';
// import { Rol } from './decorators/rol/rol.decorator';
// import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerSchemaInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Put('user')
    @Schema('public')
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signin(signInDto);
    }
    @Get('profile')
    @Schema('auth')
    @UseGuards(JwtAuthGuard)
    profile(@AuthUser() user: User) {
        return user;
    }
    @Post('user')
    signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signup(signUpDto);
    }
}
