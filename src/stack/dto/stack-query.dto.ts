import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class StackQueryDto {
  @ApiPropertyOptional({ description: 'Stack nomi bo‘yicha filter' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Sort maydoni', enum: ['id', 'name', 'createdAt'] })
  @IsOptional()
  @IsIn(['id', 'name', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort tartibi', enum: ['asc', 'desc'] })
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
