import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EthDto {
  @ApiProperty({
    description: 'Public key',
    example: 'OndkasMnuiz6H+McjvdImmU2Wa8pj7I+skooEJusnko=',
  })
  @IsNotEmpty()
  @IsString()
  publicKey: string;

  @ApiProperty({
    description: 'Message',
    example: 'Hello world!',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
