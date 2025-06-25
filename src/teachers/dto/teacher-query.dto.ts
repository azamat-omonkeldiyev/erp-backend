import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class TeacherQueryDto {
  @ApiPropertyOptional({ description: 'Stack ID' })
  @IsOptional()
  @IsNumberString()
  stackId?: string;

  @ApiPropertyOptional({ description: 'Region ID' })
  @IsOptional()
  @IsNumberString()
  regionId?: string;

  @ApiPropertyOptional({ description: 'Status ID' })
  @IsOptional()
  @IsNumberString()
  statusId?: string;

  @ApiPropertyOptional({ description: 'Group ID (main/support)' })
  @IsOptional()
  @IsNumberString()
  groupId?: string;

  @ApiPropertyOptional({ description: 'Group name (main/support)' })
  @IsOptional()
  @IsString()
  groupName?: string;

  @ApiPropertyOptional({ description: 'Ism bo‘yicha filter' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Familiya bo‘yicha filter' })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({ description: 'WorkCompany ID' })
  @IsOptional()
  @IsNumberString()
  workCompanyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Sort qatori (createdAt, age, name...)' })
  @IsOptional()
  @IsString()
  orderBy?: string;
}
