import { Exclude, Expose, Type } from 'class-transformer';
import { OfferDto } from 'src/offers/dto/offer.dto';
import { User } from 'src/users/user.entity';

@Exclude()
export class WishDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  name: string;

  @Expose()
  link: string;

  @Expose()
  image: string;

  @Expose()
  price: number;

  @Expose()
  raised: number;

  @Expose()
  description: string;

  @Expose()
  copied: number;

  @Expose()
  owner: User;

  @Expose()
  @Type(() => OfferDto)
  offers: OfferDto[];
}
