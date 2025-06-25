import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsArray
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty()
  @IsInt()
  stackId: number;

  @ApiProperty()
  @IsInt()
  regionId: number;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsInt()
  statusId: number;

  @ApiProperty()
  @IsString()
  experience: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  isMerried: string;

  @ApiProperty()
  @IsString()
  study: string;

  @ApiProperty({ type: [Number], description: 'WorkList ID lar ro‘yxati' })
  @IsArray()
  workCompanyIds: number[];
}