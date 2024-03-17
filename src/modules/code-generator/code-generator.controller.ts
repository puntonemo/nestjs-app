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
        if (form.files) {
            codegen(form.files);
        }
        return { config: JSON.parse(form.config) };
    }
}

const codegen = (fullcode: string) => {
    const i = fullcode.indexOf('index.ts');
    if (i > 0) {
        extractFragment(fullcode, i);
    }
};

const extractFragment = (fullcode: string, index: number) => {
    const endOfBlock = fullcode.indexOf('end of index.ts', index);
    const enfOfComment = fullcode.indexOf('***/', index);
    if (endOfBlock > 0) {

    }
};
