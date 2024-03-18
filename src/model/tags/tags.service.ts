import { Injectable } from '@nestjs/common';
import { User } from '@model/users';
import {
    TagsRepository,
    CreateTagDto,
    FindTagDto,
    UpdateTagDto
} from '@model/tags';

@Injectable()
export class TagsService {
    constructor(private readonly tagsRepository: TagsRepository) {}
    create(createTagDto: CreateTagDto, user: User) {
        return this.tagsRepository.create(createTagDto, user);
    }

    findAll(filters: FindTagDto) {
        return this.tagsRepository.findAll(filters);
    }

    findOne(id: number) {
        return this.tagsRepository.findOne(id);
    }

    update(id: number, updateTagDto: UpdateTagDto, user: User) {
        return this.tagsRepository.update(id, updateTagDto, user);
    }

    remove(id: number) {
        return this.tagsRepository.remove(id);
    }
}
