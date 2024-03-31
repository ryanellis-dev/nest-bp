import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserParamsDto } from './dto/user-params.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Delete('/:userId')
  deleteUser(@Param() params: UserParamsDto) {
    return this.usersService.deleteUser(params.userId);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}
