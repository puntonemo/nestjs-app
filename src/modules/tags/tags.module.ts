import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsRepository } from '@model/tag/tag.model';
import { DatabaseModule } from '@lib/database';

@Module({
    imports: [DatabaseModule],
    controllers: [TagsController],
    providers: [TagsService, TagsRepository]
})
export class TagsModule {}
