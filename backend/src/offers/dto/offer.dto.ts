import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { WishDto } from 'src/wishes/dto/wish.dto';

@Exclude()
export class OfferDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  user: User;

  @Expose()
  item: WishDto;

  @Expose()
  amount: number;

  @Exclude()
  hidden: boolean;

  @Expose()
  @Transform(({ obj }) =>
    obj.hidden ? 'Неизвестный пользователь' : obj.user.username,
  )
  name: string;
}
