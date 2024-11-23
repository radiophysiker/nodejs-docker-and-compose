import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

import { UserWishesController } from './user-wishes.controller';
import { Wish } from './wish.entity';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Wish])],
  controllers: [WishesController, UserWishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
