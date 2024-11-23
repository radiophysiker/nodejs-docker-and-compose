import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.authService.register(createUserDto);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    try {
      const user = await this.authService.login(req.user);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }
}
