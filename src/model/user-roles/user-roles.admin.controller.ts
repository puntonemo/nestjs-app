import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query
} from '@nestjs/common';
import { UserRolesService } from './user-roles.admin.service';
import {
    FindUserRolDto,
    CreateUserRolDto,
    UpdateUserRolDto
} from '@model/user-roles';
import { JwtAuthGuard } from '@lib/auth/guards/jwt.guard';
import { User } from '@model/users';
import { AuthUser } from '@lib/auth/decorators/user.decorator';
import { Permission } from '@lib/auth/decorators/permission.decorator';
import { PermissionsGuard } from '@lib/auth/guards/permission.guard';

@Controller('admin/user-roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permission('users_management')
export class UserRolesController {
    constructor(private readonly userRolesService: UserRolesService) {}

    @Post()
    create(@Body() createUserRolDto: CreateUserRolDto, @AuthUser() user: User) {
        return this.userRolesService.create(createUserRolDto, user);
    }

    @Get()
    findAll(@Query() filters: FindUserRolDto) {
        return this.userRolesService.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userRolesService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserRolDto: UpdateUserRolDto,
        @AuthUser() user: User
    ) {
        return this.userRolesService.update(id, updateUserRolDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userRolesService.remove(id);
    }
}
