import { IsUrl, Length, Min } from 'class-validator';
import { Offer } from 'src/offers/offer.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @Length(1, 250, {
    message: 'Название подарка должно быть от 1 до 250 символов.',
  })
  name: string;

  @Column()
  @IsUrl({}, { message: 'Ссылка подарка должна быть валидным URL.' })
  link: string;

  @Column()
  @IsUrl({}, { message: 'Ссылка на изображение должна быть валидным URL.' })
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Min(0)
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @Min(0)
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
