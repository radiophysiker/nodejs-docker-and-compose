import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const owner = await this.usersService.findById(ownerId);
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner,
      raised: 0,
      copied: 0,
      offers: [],
    });
    await this.wishRepository.save(wish);
    return wish;
  }

  async findOne(query: FindOptionsWhere<Wish>): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: query,
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }

  async findMany(query: FindOptionsWhere<Wish>): Promise<Wish[]> {
    return this.wishRepository.find({
      where: query,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async removeOne(query: FindOptionsWhere<Wish>) {
    const wish = await this.findOne(query);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    await this.wishRepository.remove(wish);
    return { message: 'Wish removed' };
  }

  async findById(id: number): Promise<Wish> {
    return this.findOne({ id });
  }

  async updateOne(
    query: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findOne(query);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие пожелания',
      );
    }

    // Проверка, если пытаются изменить цену и есть заявки
    if (updateWishDto.price !== undefined && wish.raised > 0) {
      throw new BadRequestException(
        'Невозможно изменить цену, так как есть заявки',
      );
    }

    // Нельзя изменять поле 'raised'
    if ('raised' in updateWishDto) {
      throw new BadRequestException('Поле "raised" нельзя изменять напрямую');
    }

    // Обновляем пожелание
    Object.assign(wish, updateWishDto);
    await this.wishRepository.save(wish);

    return wish;
  }

  async remove(id: number, userId: number): Promise<void> {
    const wish = await this.findById(id);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие пожелания');
    }

    await this.wishRepository.remove(wish);
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    const originalWish = await this.findById(id);

    const owner = await this.usersService.findById(userId);
    if (!owner) {
      throw new NotFoundException('Пользователь не найден');
    }

    const copiedWish = this.wishRepository.create({
      name: originalWish.name,
      link: originalWish.link,
      image: originalWish.image,
      price: originalWish.price,
      description: originalWish.description,
      owner,
      raised: 0,
      copied: 0,
      offers: [],
    });

    await this.wishRepository.save(copiedWish);

    originalWish.copied += 1;
    await this.wishRepository.save(originalWish);

    return copiedWish;
  }

  async getLatestWishes(limit: number): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getPopularWishes(limit: number): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: limit,
    });
  }

  async save(wish: Wish): Promise<Wish> {
    return this.wishRepository.save(wish);
  }
}
