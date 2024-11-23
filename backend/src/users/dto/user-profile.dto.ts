import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class UserProfileDto {
  @Expose()
  id: number;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Имя пользователя должно быть строкой.' })
  @Length(2, 30, {
    message: 'Имя пользователя должно быть от 2 до 30 символов.',
  })
  username: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'О себе должно быть строкой.' })
  @Length(2, 200, { message: 'О себе должно быть от 2 до 200 символов.' })
  about: string;

  @Expose()
  @IsOptional()
  @IsUrl({}, { message: 'Аватар должен быть URL-адресом.' })
  avatar: string;

  @Expose()
  @IsOptional()
  @IsEmail(
    { allow_display_name: true },
    { message: 'Некорректная электронная почта.' },
  )
  email: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Exclude()
  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой.' })
  @Length(6, 30, { message: 'Пароль должен быть от 6 до 30 символов.' })
  @Matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Пароль должен содержать хотя бы одну цифру, одну строчную и одну заглавную букву.',
  })
  password: string;

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
}
