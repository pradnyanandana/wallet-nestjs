import {
  IsString,
  IsEmail,
  IsAlphanumeric,
  IsDate,
  IsEnum,
  Length,
} from 'class-validator';

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
  @IsString()
  @Length(2, 20)
  firstName: string;

  @IsString()
  @Length(2, 20)
  lastName: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  @Length(5, 40)
  streetAddress: string;

  @IsString()
  @Length(2, 20)
  city: string;

  @IsEnum(Province)
  province: Province;

  @IsString()
  telephoneNumber: string;

  @IsEmail()
  email: string;

  @IsAlphanumeric()
  username: string;

  @IsString()
  password: string;
}
