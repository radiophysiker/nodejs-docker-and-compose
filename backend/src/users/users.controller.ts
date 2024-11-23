import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { FindUsersDto } from './dto/find-users.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req): Promise<UserProfileDto> {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    return plainToClass(UserProfileDto, user);
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    return plainToClass(User, user);
  }

  @Patch('me')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UserProfileDto,
  ): Promise<UserProfileDto> {
    const userId = req.user.userId;
    const user = await this.usersService.updateOne(
      { id: userId },
      updateUserDto,
    );
    return plainToClass(UserProfileDto, user);
  }

  @Post('find')
  async findUsers(@Body() findUsersDto: FindUsersDto): Promise<Array<User>> {
    const { query } = findUsersDto;
    const users = await this.usersService.findUsersByUsernameAndId(query);
    return users.map((user) => plainToClass(User, user));
  }
}
