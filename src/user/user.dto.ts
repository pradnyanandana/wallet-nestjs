import {
  IsString,
  IsEmail,
  IsAlphanumeric,
  IsDate,
  IsEnum,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Province {
  Aceh = 'Aceh',
  Bali = 'Bali',
  Banten = 'Banten',
  Bengkulu = 'Bengkulu',
  Gorontalo = 'Gorontalo',
  Jakarta = 'DKI Jakarta',
  Jambi = 'Jambi',
  JawaBarat = 'Jawa Barat',
  JawaTengah = 'Jawa Tengah',
  JawaTimur = 'Jawa Timur',
  KalimantanBarat = 'Kalimantan Barat',
  KalimantanSelatan = 'Kalimantan Selatan',
  KalimantanTengah = 'Kalimantan Tengah',
  KalimantanTimur = 'Kalimantan Timur',
  KalimantanUtara = 'Kalimantan Utara',
  BangkaBelitung = 'Bangka Belitung',
  KepulauanRiau = 'Kepulauan Riau',
  Lampung = 'Lampung',
  Maluku = 'Maluku',
  MalukuUtara = 'Maluku Utara',
  NusaTenggaraBarat = 'Nusa Tenggara Barat',
  NusaTenggaraTimur = 'Nusa Tenggara Timur',
  Papua = 'Papua',
  PapuaBarat = 'Papua Barat',
  Riau = 'Riau',
  SulawesiBarat = 'Sulawesi Barat',
  SulawesiSelatan = 'Sulawesi Selatan',
  SulawesiTengah = 'Sulawesi Tengah',
  SulawesiTenggara = 'Sulawesi Tenggara',
  SulawesiUtara = 'Sulawesi Utara',
  SumateraBarat = 'Sumatera Barat',
  SumateraSelatan = 'Sumatera Selatan',
  SumateraUtara = 'Sumatera Utara',
  Yogyakarta = 'Yogyakarta',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @Length(2, 20)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @Length(2, 20)
  lastName: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth' })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({
    example: '123 Street',
    description: 'Street address',
    minLength: 5,
    maxLength: 40,
  })
  @IsString()
  @Length(5, 40)
  streetAddress: string;

  @ApiProperty({
    example: 'City',
    description: 'City',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @Length(2, 20)
  city: string;

  @ApiProperty({ example: Province.Jakarta, description: 'Province' })
  @IsEnum(Province)
  province: Province;

  @ApiProperty({ example: '1234567890', description: 'Telephone number' })
  @IsString()
  telephoneNumber: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john123', description: 'Username' })
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsString()
  password: string;
}
