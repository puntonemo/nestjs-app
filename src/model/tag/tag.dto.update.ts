import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './tag.dto.create';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
