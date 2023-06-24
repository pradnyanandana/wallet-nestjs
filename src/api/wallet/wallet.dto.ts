import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WalletBalanceDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  @IsNotEmpty()
  userId: string;
}

export class TopUpWalletDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Amount to top up',
    example: 50,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class PayWithWalletDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Amount to pay',
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
