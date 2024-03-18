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
import { UsersService } from './users.service';
import { CreateUserDto } from '@model/users/users.dto.create';
import { UpdateUserDto } from '@model/users/users.dto.update';
import { JwtAuthGuard } from '@lib/auth/guards/jwt.guard';
import { FindUserDto } from '@model/users/users.dto.find';
import { User } from '@model/users/users.entity';
import { AuthUser } from '@lib/auth/decorators/user.decorator';
import { Permission } from '@lib/auth/decorators/permission.decorator';
import { PermissionsGuard } from '@lib/auth/guards/permission.guard';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permission('users_management')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto, @AuthUser() user: User) {
        return this.usersService.create(createUserDto, user);
    }

    @Get()
    findAll(@Query() filters: FindUserDto) {
        return this.usersService.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @AuthUser() user: User
    ) {
        return this.usersService.update(+id, updateUserDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
