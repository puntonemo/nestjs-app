import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LiveService } from './live.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/google')
export class GoogleController {
    constructor(private readonly liveService: LiveService) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async googleAuth(@Req() req) {}
    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.liveService.liveLogin(req);
    }
}
