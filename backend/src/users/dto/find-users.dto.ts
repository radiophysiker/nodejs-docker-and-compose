import { IsNotEmpty, IsString } from 'class-validator';

export class FindUsersDto {
  @IsNotEmpty({ message: 'Поле поиска не должно быть пустым' })
  @IsString({ message: 'Поле поиска должно быть строкой' })
  query: string;
}
