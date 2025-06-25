import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class CategoryQueryDto {
  @ApiPropertyOptional({ description: 'Qidirish uchun title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Qidirish uchun path'})
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ description: 'Sort qaysi field bo\'yicha' })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'path', 'title', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort tartibi: asc yoki desc' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Nechta element olish (limit)', example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ description: 'Qaysi sahifa (pagination)', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;
}
