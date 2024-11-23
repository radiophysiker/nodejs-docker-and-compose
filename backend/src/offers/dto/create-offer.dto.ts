import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty({ message: 'Сумма не должна быть пустой.' })
  @IsNumber({}, { message: 'Сумма должна быть числом.' })
  @Min(0.01, { message: 'Сумма должна быть больше нуля.' })
  amount: number;

  @IsNotEmpty({ message: 'ID подарка не должен быть пустым.' })
  @IsNumber({}, { message: 'ID подарка должен быть числом.' })
  itemId: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
