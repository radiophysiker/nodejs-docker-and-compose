import { IsNumber, IsOptional, IsUrl, Length, Min } from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @Length(1, 250, {
    message: 'Название подарка должно быть от 1 до 250 символов.',
  })
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Ссылка подарка должна быть валидным URL.' })
  link?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Ссылка на изображение должна быть валидным URL.' })
  image?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Цена должна быть числом.' })
  @Min(0, { message: 'Цена должна быть не меньше 0.' })
  price?: number;

  @IsOptional()
  @Length(1, 1024, {
    message: 'Описание должно быть от 1 до 1024 символов.',
  })
  description?: string;
}
