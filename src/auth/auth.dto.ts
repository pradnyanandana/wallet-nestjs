import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email or username',
  })
  @IsString()
  emailOrUsername: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsString()
  password: string;
}
