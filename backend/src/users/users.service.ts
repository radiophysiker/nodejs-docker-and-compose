import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким email или именем уже существует.',
      );
    }
    const { password, ...rest } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  async findOne(
    query: FindOptionsWhere<User>,
    select?: (keyof User)[],
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: query,
      select,
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findMany(query: FindOptionsWhere<User>[]): Promise<User[]> {
    return this.userRepository.find({
      where: query,
    });
  }

  async removeOne(query: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOne({ where: query });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    await this.userRepository.remove(user);
    return user;
  }

  async updateOne(
    query: FindOptionsWhere<User>,
    updateUserDto: UserProfileDto,
  ) {
    const user = await this.userRepository.findOne({ where: query });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const { email, username, password } = updateUserDto;
    if (email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
        select: ['id'],
      });
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException(
          'Email уже используется другим пользователем',
        );
      }
    }

    if (username) {
      const existingUser = await this.userRepository.findOne({
        where: { username },
        select: ['id'],
      });
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('Имя пользователя уже занято');
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(password, salt);
    }

    await this.userRepository.update(user.id, updateUserDto);

    return this.findById(user.id);
  }

  async findUsersByUsernameAndId(query: string): Promise<User[]> {
    return this.findMany([
      { username: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ]);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.findOne({ id });
  }
}
