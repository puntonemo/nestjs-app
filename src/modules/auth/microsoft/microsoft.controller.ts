import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MicrosoftService } from './microsoft.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/microsoft')
export class MicrosoftController {
    constructor(private readonly liveService: MicrosoftService) {}

    @Get()
    @UseGuards(AuthGuard('microsoft'))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async googleAuth(@Req() req) {}
    @Get('redirect')
    @UseGuards(AuthGuard('microsoft'))
    liveAuthRedirect(@Req() req) {
        return this.liveService.liveLogin(req);
    }
}
