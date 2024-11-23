import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.findMany({});
  }

  async findMany(query: FindOptionsWhere<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: query,
      relations: ['owner', 'items'],
    });
  }

  async findOne(query: FindOptionsWhere<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: query,
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async removeOne(
    query: FindOptionsWhere<Wishlist>,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(query);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие списки');
    }
    return await this.wishlistRepository.remove(wishlist);
  }

  async findById(id: number): Promise<Wishlist> {
    return this.findOne({ id });
  }

  async create(createWishlistDto: CreateWishlistDto, ownerId: number) {
    const owner = await this.usersService.findById(ownerId);
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }
    const itemIds = createWishlistDto.itemsId;
    const items =
      itemIds && itemIds.length > 0
        ? await this.wishesService.findMany({ id: In(itemIds) })
        : [];

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      items,
      owner,
    });
    await this.wishlistRepository.save(wishlist);

    return wishlist;
  }

  async updateOne(
    query: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(query);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете редактировать чужие списки');
    }
    Object.assign(wishlist, updateWishlistDto);
    await this.wishlistRepository.save(wishlist);
    return wishlist;
  }

  async removeById(id: number, userId: number): Promise<void> {
    await this.removeOne({ id }, userId);
  }
}
