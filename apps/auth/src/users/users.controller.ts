import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorator/current-user.decorator';
import { JwtAuthGuard } from '../guards/jaw-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './models/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: UserDocument) {
    return user;
  }
}
