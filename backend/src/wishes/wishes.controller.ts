import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { plainToClass } from 'class-transformer';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './wish.entity';
import { WishesService } from './wishes.service';
import { WishDto } from './dto/wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Public()
  @Get('last')
  async getLatestWishes(): Promise<Wish[]> {
    const wishes = await this.wishesService.getLatestWishes(40);
    return wishes.map((wish) => plainToClass(WishDto, wish));
  }

  @Public()
  @Get('top')
  async getPopularWishes(): Promise<Wish[]> {
    const wishes = await this.wishesService.getPopularWishes(20);
    return wishes.map((wish) => plainToClass(WishDto, wish));
  }

  @Get(':id')
  async getWishById(@Param('id', ParseIntPipe) id: number): Promise<Wish> {
    const wish = await this.wishesService.findById(id);
    return plainToClass(WishDto, wish);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    await this.wishesService.remove(id, userId);
    return { message: 'Пожелание успешно удалено' };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const wish = await this.wishesService.updateOne(
      { id },
      updateWishDto,
      userId,
    );
    return plainToClass(WishDto, wish);
  }

  @Post(':id/copy')
  async copyWish(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    const wish = this.wishesService.copyWish(id, userId);
    return plainToClass(WishDto, wish);
  }

  @Post()
  async createWish(
    @Body() createWishDto: CreateWishDto,
    @Request() req,
  ): Promise<Wish> {
    const userId = req.user.userId;
    const wish = await this.wishesService.create(createWishDto, userId);
    return plainToClass(WishDto, wish);
  }
}
