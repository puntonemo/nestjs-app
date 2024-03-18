import { Module } from '@nestjs/common';
import { TagsService } from '@model/tags/tags.service';
import { TagsController } from '@model/tags/tags.controller';
import { TagsRepository } from '@model/tags';
import { SupabaseService } from '@lib/database';

@Module({
    controllers: [TagsController],
    providers: [TagsService, TagsRepository, SupabaseService]
})
export class TagsModule {}
