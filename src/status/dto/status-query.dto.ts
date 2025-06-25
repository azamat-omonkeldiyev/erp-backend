import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class StatusQueryDto {
  @ApiPropertyOptional({description: 'Status nomi bo‘yicha filter' })
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

  @ApiPropertyOptional({ example: '10', description: 'Limit' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: '1', description: 'Page raqami' })
  @IsOptional()
  @IsNumberString()
  page?: string;
}
