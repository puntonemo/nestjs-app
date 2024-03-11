import { Body, Controller, Get, Post, Render } from '@nestjs/common';

@Controller('code-generator')
export class CodeGeneratorController {
    @Get()
    @Render('code-generator/index')
    default(): object {
        return { title: 'Title', subtitle: 'Subtitle' };
    }
    @Get('model')
    @Render('code-generator/model')
    model(): object {
        return;
    }
    @Post('model')
    @Render('code-generator/model')
    modelGenerate(@Body() form): object {
        return { config: JSON.parse(form.config) };
    }
}
