import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from '.';

export class UpdateTagDto extends PartialType(CreateTagDto) {}