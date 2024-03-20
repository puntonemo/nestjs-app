import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LiveService } from './live.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/live')
export class LiveController {
    constructor(private readonly liveService: LiveService) {}

    @Get()
    @UseGuards(AuthGuard('windowslive'))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async googleAuth(@Req() req) {}
    @Get('redirect')
    @UseGuards(AuthGuard('windowslive'))
    liveAuthRedirect(@Req() req) {
        return this.liveService.liveLogin(req);
    }
}
