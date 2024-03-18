import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Patch,
    Param,
    Delete
    // UseGuards
    // UseInterceptors
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, FindTagDto, UpdateTagDto } from '@model/tag/tag.model';
import { User } from '@model/users/users.entity';
import { AuthUser } from '@lib/auth/decorators/user.decorator';
// import { isPublic } from '@@lib/auth/decorators/isPublic.decorator';
// import { Rol } from '@@lib/auth/decorators/rol.decorator';
// import { JwtAuthGuard } from '@@lib/auth/guards/jwt.guard';
// import { RolesGuard } from '@@lib/auth/guards/roles.guard';
// import { SchemaFromRol } from '@lib/core/interceptors/ClassSerializerSchema.decorators';
// import { ClassSerializerSchemaInterceptor } from '@lib/core/interceptors/ClassSerializerSchema';

@Controller('tags')
// @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
// @UseInterceptors(ClassSerializerSchemaInterceptor)
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    create(@Body() createTagDto: CreateTagDto, @AuthUser() user: User) {
        return this.tagsService.create(createTagDto, user);
    }

    @Get()
    //@isPublic()
    findAll(@Query() filters: FindTagDto) {
        return this.tagsService.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagsService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTagDto: UpdateTagDto,
        @AuthUser() user: User
    ) {
        return this.tagsService.update(+id, updateTagDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tagsService.remove(+id);
    }
}
