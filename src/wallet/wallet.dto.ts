import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WalletDto {
  @ApiProperty({
    description: 'Amount to top up',
    example: 50,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
