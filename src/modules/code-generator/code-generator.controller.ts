import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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
        const config = JSON.parse(form.config);

        if (form.files) {
            codegen(form.files, config);
        }
        return { config };
    }
}

const codegen = (fullcode: string, config: any) => {
    const modelName = config.model_name;
    console.log(modelName);
    const indexFileText = 'index.ts';
    const entityFileText = 'product.entity.ts';

    extractFragment(fullcode, indexFileText);
    extractFragment(fullcode, entityFileText);
};

const extractFragment = (fullcode: string, fragmentName: string) => {
    const index = fullcode.indexOf(`/*** ${fragmentName}`);
    const endOfBlockText = `end of ${fragmentName}`;
    const endOfCommentText = '***/';
    const beginOfPathText = `${fragmentName} *`;
    const endOfBlock = fullcode.indexOf(endOfBlockText, index);
    const beginOfPath = fullcode.indexOf(beginOfPathText, index);
    const endOfPath = fullcode.indexOf(
        `*`,
        beginOfPath + beginOfPathText.length
    );
    const fragmentPath = fullcode
        .substring(beginOfPath + beginOfPathText.length, endOfPath)
        .trim();
    const endOfComment = fullcode.indexOf(endOfCommentText, index);
    if (endOfBlock > 0 && endOfComment > 0) {
        const codeBlock = fullcode.substring(endOfComment + 6, endOfBlock - 5);
        console.log(codeBlock);
        const filePath = path.join(
            process.env.PWD,
            fragmentPath,
            `/${fragmentName}.txt`
        );
        console.log(filePath);
        fs.mkdir(filePath, { recursive: true } as any);
        //fs.writeFileSync(filePath, codeBlock);
    }
};
