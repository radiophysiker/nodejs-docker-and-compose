import { Controller, Get, Req } from '@nestjs/common';

import { Wish } from './wish.entity';
import { WishesService } from './wishes.service';

@Controller('users/me/wishes')
export class UserWishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get()
  async getUserWishes(@Req() req): Promise<Wish[]> {
    const userId = req.user.userId;
    return this.wishesService.findMany({ owner: { id: userId } });
  }
}
