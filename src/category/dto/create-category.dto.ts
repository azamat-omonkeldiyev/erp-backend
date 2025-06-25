import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '/technology', description: 'Kategoriya yo\'li' })
  @IsString()
  path: string;

  @ApiProperty({ example: 'Technology', description: 'Kategoriya nomi' })
  @IsString()
  title: string;
}