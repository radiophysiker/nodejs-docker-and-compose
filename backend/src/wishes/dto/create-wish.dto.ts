import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty({ message: 'Название не должно быть пустым.' })
  @Length(1, 250, {
    message: 'Длина названия должна быть от 1 до 250 символов.',
  })
  @IsString({ message: 'Название должно быть строкой.' })
  name: string;

  @IsNotEmpty({ message: 'Ссылка не должна быть пустой.' })
  @IsUrl({}, { message: 'Ссылка должна быть URL-адресом.' })
  link: string;

  @IsUrl({}, { message: 'Изображение должно быть URL-адресом.' })
  image: string;

  @IsNotEmpty({ message: 'Описание не должно быть пустым' })
  @Length(1, 1024, {
    message: 'Длина описания должна быть от 1 до 1024 символов.',
  })
  description: string;

  @IsNotEmpty({ message: 'Цена не должна быть пустой.' })
  @IsNumber({}, { message: 'Цена должна быть числом.' })
  @Min(0, { message: 'Цена должна быть не меньше 0.' })
  price: number;
}
