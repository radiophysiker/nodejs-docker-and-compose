import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './offer.entity';
import { OffersService } from './offers.service';
import { OfferDto } from './dto/offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOffer(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    const userId = req.user.userId;
    const offers = await this.offersService.create(userId, createOfferDto);
    return plainToClass(OfferDto, offers);
  }

  @Get()
  async findAll(): Promise<Offer[]> {
    const offers = await this.offersService.findAll();
    return offers.map((offer) => plainToClass(OfferDto, offer));
  }

  @Get(':id')
  async getWishById(@Param('id', ParseIntPipe) id: number): Promise<Offer> {
    const offer = await this.offersService.findById(id);
    return plainToClass(OfferDto, offer);
  }
}
