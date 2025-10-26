import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  clientName: string;

  @IsNotEmpty()
  productName: string;

  @IsNumber()
  value: number;
}
