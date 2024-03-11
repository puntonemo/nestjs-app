import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { DefaultService } from './default.service';

@Controller('default')
export class DefaultController {
    constructor(private readonly defaultService: DefaultService) {}
    @Get()
    @Post()
    @Render('default/index')
    default(): object {
        return { title: 'Title', subtitle: 'Subtitle' };
    }
    @Post()
    @Render('default/index')
    defaultPost(@Body() body): object {
        return { title: 'Title Posted', subtitle: 'Subtitle Posted', ...body };
    }
}
