import { Body, Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { DefaultService } from './default.service';
import { isPublic } from '@lib/auth/decorators/isPublic.decorator';
import { AuthUser } from '@lib/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt.guard';

@Controller()
export class DefaultController {
    constructor(private readonly defaultService: DefaultService) {}
    @Get()
    @Post()
    @Render('default/index')
    @isPublic()
    @UseGuards(JwtAuthGuard)
    default(@AuthUser() user): object {
        console.log(user);
        return { user };
    }
    @Post()
    @Render('default/index')
    defaultPost(@Body() body): object {
        return { title: 'Title Posted', subtitle: 'Subtitle Posted', ...body };
    }
}
