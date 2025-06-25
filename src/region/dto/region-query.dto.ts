import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class RegionQueryDto {
  @ApiPropertyOptional({ description: 'Region nomi bo‘yicha qidiruv' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: ['id', 'name', 'createdAt'], description: 'Sort maydoni' })
  @IsOptional()
  @IsIn(['id', 'name', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Sort tartibi' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: '10', description: 'Limit (nechta element)' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: '2', description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString()
  page?: string;
}
