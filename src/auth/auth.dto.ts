import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email or username',
  })
  @IsString()
  emailOrUsername: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  password: string;
}
