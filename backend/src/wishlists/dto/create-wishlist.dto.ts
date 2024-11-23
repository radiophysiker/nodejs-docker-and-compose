import { IsInt, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @Length(1, 250, { message: 'Название должно быть от 1 до 250 символов' })
  name: string;

  @IsOptional()
  @Length(0, 1500, { message: 'Описание должно быть до 1500 символов' })
  description?: string;

  @IsUrl({}, { message: 'Некорректная ссылка на изображение' })
  image: string;

  @IsOptional()
  @IsInt({ each: true })
  itemsId?: number[];
}
