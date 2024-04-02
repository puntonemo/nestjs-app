import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Query,
    Render,
    Req,
    Res,
    Session,
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
import { User } from '@model/users/users.entity';
import { ClassSerializerSchemaInterceptor } from '@lib/interceptors/ClassSerializerSchema';
import { RemoteAddress } from '@lib/auth/decorators/remoteAddress';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
// import { Rol } from './decorators/rol/rol.decorator';
// import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerSchemaInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}
    /******************************************************************
     * SIGN IN WITH PASSWORD
     * @param signInDto
     * @returns AuthResponse
     */
    @Put('user')
    @Schema('public')
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signin(signInDto);
    }
    /**
     * GET USER PROFILE
     * @param user Signed in user
     * @returns User profile
     */
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
    @Get('challenge')
    async GenerateRegistrationOptions(
        @Session() session: Record<string, any>,
        @RemoteAddress() remoteAddress: string,
        @Query('username') username?: string
    ) {
        const webauthFlowData = await this.authService.getChallenge(
            username,
            remoteAddress
        );
        const { challenge, credentials } = webauthFlowData;

        session.webauthFlowData = webauthFlowData;
        return { challenge, credentials };
    }
    @Post('credential')
    async setCredential(
        @Session() session: Record<string, any>,
        @RemoteAddress() remoteAddress: string,
        @Req() req: Request,
        @Body() body: Body
    ) {
        return this.authService.setCredential(
            body,
            session.webauthFlowData,
            remoteAddress,
            req.headers
        );
    }
    /** GOOGLE LOGIN **/
    @Get('google')
    async googleAuth(
        @Session() session,
        @Res() res: Response,
        @Query('state') state?: string
    ) {
        session.state = state;
        res.redirect('/auth/google2');
    }
    @Get('google2')
    @UseGuards(AuthGuard('google'))
    async googleAuth2() {}
    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res, @Session() session) {
        const response = (await this.authService.passportLogin(
            req,
            'google'
        )) as any;
        const state = session.state;
        session.state = undefined;
        const AUTH_CALLBACK_URI = this.configService.get('AUTH_CALLBACK_URI');

        if (response.result === 'ok') {
            const url = new URL(AUTH_CALLBACK_URI);
            if (response.token)
                url.searchParams.append('_token', response.token);
            if (response.signInMode)
                url.searchParams.append('_signInMode', response.signInMode);
            if (response.event)
                url.searchParams.append('_event', response.event);
            if (state) url.searchParams.append('_state', state);
            res.redirect(url);
        }
    }
    /** MICROSOFT LOGIN **/
    @Get('microsoft')
    async microsoftAuth(
        @Session() session,
        @Res() res: Response,
        @Query('state') state?: string
    ) {
        session.state = state;
        res.redirect('/auth/microsoft2');
    }
    @Get('microsoft2')
    @UseGuards(AuthGuard('microsoft'))
    async microsoftAuth2() {}
    @Get('microsoft/redirect')
    @UseGuards(AuthGuard('microsoft'))
    async microsoftAuthRedirect(@Req() req, @Res() res, @Session() session) {
        const response = (await this.authService.passportLogin(
            req,
            'microsoft'
        )) as any;
        const state = session.state;
        session.state = undefined;
        const AUTH_CALLBACK_URI = this.configService.get('AUTH_CALLBACK_URI');

        if (response.result === 'ok') {
            const url = new URL(AUTH_CALLBACK_URI);
            if (response.token)
                url.searchParams.append('_token', response.token);
            if (response.signInMode)
                url.searchParams.append('_signInMode', response.signInMode);
            if (response.event)
                url.searchParams.append('_event', response.event);
            if (state) url.searchParams.append('_state', state);
            res.redirect(url);
        }
    }
    @Get('signin')
    @Render('auth/signin')
    signin_view() {
        return {
            AUTH_CALLBACK_URI: this.configService.get('AUTH_CALLBACK_URI')
        };
    }

    @Get('signup')
    @Render('auth/signup')
    signup_view() {}

    @Get('callback')
    @Render('auth/callback')
    callback_view() {}

    @Get('signout')
    @Render('auth/signout')
    signout_view() {}
}
