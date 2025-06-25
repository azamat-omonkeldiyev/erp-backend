import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class RoomQueryDto {
  @ApiPropertyOptional({ description: 'Xona nomi bo‘yicha qidiruv' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({  enum: ['id', 'numberId', 'name', 'createdAt'] })
  @IsOptional()
  @IsIn(['id', 'numberId', 'name', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: '10', description: 'Limit' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: '1', description: 'Sahifa' })
  @IsOptional()
  @IsNumberString()
  page?: string;
}
