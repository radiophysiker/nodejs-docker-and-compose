import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    userId: number,
    { itemId, amount, hidden }: CreateOfferDto,
  ): Promise<Offer> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const wish = await this.wishesService.findById(itemId);

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете скинуться на свой собственный подарок.',
      );
    }

    const totalCollected = wish.offers.reduce(
      (sum, offer) => sum + Number(offer.amount),
      0,
    );

    if (totalCollected >= wish.price) {
      throw new BadRequestException(
        'На этот подарок уже собраны необходимые средства.',
      );
    }

    if (totalCollected + amount > wish.price) {
      throw new BadRequestException(
        `Сумма сбора превышает на ${totalCollected + amount - wish.price}, чем необходимую для этого подарка.`,
      );
    }

    const offer = this.offerRepository.create({
      user,
      item: wish,
      amount: amount,
      hidden: hidden,
    });

    await this.offerRepository.save(offer);

    const raised = totalCollected + amount;
    wish.raised = raised;
    wish.offers.push(offer);
    await this.wishesService.save(wish);

    return offer;
  }

  async findOne(query: FindOptionsWhere<Offer>): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: query,
      relations: ['user', 'wishes'],
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  async removeOne(
    query: FindOptionsWhere<Offer>,
    userId: number,
  ): Promise<void> {
    const offer = await this.findOne(query);

    if (offer.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own offers');
    }

    await this.offerRepository.remove(offer);
  }

  async updateOne(
    query: FindOptionsWhere<Offer>,
    updateOfferDto: CreateOfferDto,
  ) {
    const offer = await this.findOne(query);

    this.offerRepository.save({ ...offer, ...updateOfferDto });
    return offer;
  }

  async findMany(query: FindOptionsWhere<Offer>): Promise<Offer[]> {
    return this.offerRepository.find({
      where: query,
      relations: ['user', 'wishes'],
    });
  }

  async findAll(): Promise<Offer[]> {
    return this.findMany({});
  }

  async findById(id: number): Promise<Offer> {
    return this.findOne({ id });
  }
}
