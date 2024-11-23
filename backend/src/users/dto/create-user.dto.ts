import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Имя пользователя не должно быть пустым.' })
  @IsString({ message: 'Имя пользователя должно быть строкой.' })
  @Length(2, 30, {
    message: 'Имя пользователя должно быть от 2 до 30 символов.',
  })
  username: string;

  @IsNotEmpty({ message: 'Электронная почта не должна быть пустым.' })
  @IsEmail({}, { message: 'Некорректная электронная почта.' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым.' })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @Length(6, 30, { message: 'Пароль должен быть от 6 до 30 символов.' })
  @Matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Пароль должен содержать хотя бы одну цифру, одну строчную и одну заглавную букву.',
  })
  password: string;

  @IsOptional()
  @IsUrl({}, { message: 'Аватар должен быть URL-адресом.' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'О себе должно быть строкой.' })
  @Length(2, 200, { message: 'О себе должно быть от 2 до 200 символов.' })
  about?: string;
}
