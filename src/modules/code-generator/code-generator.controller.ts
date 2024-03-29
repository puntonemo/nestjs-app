import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('code-generator')
export class CodeGeneratorController {
    @Get()
    @Render('code-generator/index')
    model(): object {
        return;
    }
    @Post()
    @Render('code-generator/index')
    modelGenerate(@Body() form): object {
        const config = JSON.parse(form.config);

        if (form.files) {
            codegen(form.files, config);
        }
        return { config };
    }
}

const codegen = (fullcode: string, config: any) => {
    const reModelPath = /\/\/\s*model_path\s*=*(.[^\r\n]*)\r*\n*/g;
    const rerModelPath = [...fullcode.matchAll(reModelPath)];

    if (rerModelPath.length != 1) return;

    const fragmentPath = rerModelPath[0][1].trim();
    const regexp = /\/\*\*\*\sbegin of\s(.[^\*]*)/g;
    const array = [...fullcode.matchAll(regexp)];

    const filePath = path.join(
        process.env.PWD || process.env.INIT_CWD,
        fragmentPath
    );

    fs.mkdirSync(filePath, { recursive: true } as any);

    const fileName = path.join(filePath, `/config.json`);

    fs.writeFileSync(fileName, JSON.stringify(config, null, '\t'));

    for (const item of array) {
        extractFragment(fullcode, item[1].trim(), filePath);
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
    const endOfComment = fullcode.indexOf(endOfCommentText, index);
    if (endOfBlock > 0 && endOfComment > 0) {
        const codeBlock = fullcode.substring(endOfComment + 6, endOfBlock - 4);

        const fileName = path.join(fragmentPath, `/${fragmentName}`);

        fs.writeFileSync(fileName, codeBlock);
    }
};
