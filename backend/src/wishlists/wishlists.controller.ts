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
import { plainToClass } from 'class-transformer';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './wishlist.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @Get()
  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistService.findAll();
    return wishlists.map((wish) => plainToClass(Wishlist, wish));
  }

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Request() req,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistService.create(
      createWishlistDto,
      req.user.userId,
    );
    return plainToClass(Wishlist, wishlist);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistService.findById(id);
    return plainToClass(Wishlist, wishlist);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Request() req,
  ) {
    const wishlist = await this.wishlistService.updateOne(
      { id },
      updateWishlistDto,
      req.user.userId,
    );
    return plainToClass(Wishlist, wishlist);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    this.wishlistService.removeById(id, req.user.userId);
    return { message: 'Список желаний успешно удален' };
  }
}
