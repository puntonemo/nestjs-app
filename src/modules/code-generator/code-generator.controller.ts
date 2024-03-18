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

    /* \/\*\*\*\sbegin of\s(.[^\*]*) */

    const reModelPath = /\/\/\s*model_path\s*=*(.[^\r\n]*)\r*\n*/g;
    const rerModelPath = [...fullcode.matchAll(reModelPath)];

    console.log(rerModelPath);
    if (rerModelPath.length != 1) return;
    const fragmentPath = rerModelPath[0][1].trim();
    const regexp = /\/\*\*\*\sbegin of\s(.[^\*]*)/g;
    const array = [...fullcode.matchAll(regexp)];

    for (const item of array) {
        extractFragment(fullcode, item[1].trim(), fragmentPath);
    }
};

const extractFragment = (
    fullcode: string,
    fragmentName: string,
    fragmentPath: string
) => {
    const index = fullcode.indexOf(`${fragmentName}`);
    const endOfBlockText = `end of ${fragmentName}`;
    const endOfCommentText = '***/';
    const endOfBlock = fullcode.indexOf(endOfBlockText, index);
    //const fragmentPath = '/src/model';
    const endOfComment = fullcode.indexOf(endOfCommentText, index);
    if (endOfBlock > 0 && endOfComment > 0) {
        const codeBlock = fullcode.substring(endOfComment + 6, endOfBlock - 4);
        //console.log(codeBlock);
        const filePath = path.join(
            process.env.PWD || process.env.INIT_CWD,
            fragmentPath
        );
        const fileName = path.join(filePath, `/${fragmentName}`);
        console.log(fileName);
        fs.mkdirSync(filePath, { recursive: true } as any);
        fs.writeFileSync(fileName, codeBlock);
    }
};
