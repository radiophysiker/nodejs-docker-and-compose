import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import { Offer } from 'src/offers/offer.entity';
import { Wish } from 'src/wishes/wish.entity';
import { Wishlist } from 'src/wishlists/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true, length: 30 })
  @IsNotEmpty({ message: 'Имя пользователя не должно быть пустым.' })
  @IsString({ message: 'Имя пользователя должно быть строкой.' })
  @Length(2, 30, {
    message: 'Имя пользователя должно быть от 2 до 30 символов.',
  })
  username: string;

  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @IsString({ message: 'О себе должно быть строкой.' })
  @Length(2, 200, { message: 'О себе должно быть от 2 до 200 символов.' })
  about?: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl({}, { message: 'Аватар должен быть URL-адресом.' })
  avatar?: string;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'Электронная почта не должна быть пустым.' })
  @Exclude()
  @IsEmail(
    { allow_display_name: true },
    { message: 'Некорректная электронная почта.' },
  )
  email: string;

  @Column()
  @Exclude()
  @IsNotEmpty({ message: 'Пароль не должен быть пустым.' })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @Length(6, 30, { message: 'Пароль должен быть от 6 до 30 символов.' })
  @Matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Пароль должен содержать хотя бы одну цифру, одну строчную и одну заглавную букву.',
  })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
