import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class StudentQueryDto {
    @ApiPropertyOptional({ description: 'Ism bo‘yicha filter' })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiPropertyOptional({ description: 'Familiya bo‘yicha filter' })
    @IsOptional()
    @IsString()
    surname?: string;
  
    @ApiPropertyOptional({ description: 'Group ID bo‘yicha filter' })
    @IsOptional()
    @IsNumberString()
    groupId?: string;
  
    @ApiPropertyOptional({ description: 'Group name bo‘yicha filter' })
    @IsOptional()
    @IsString()
    groupName?: string;
  
    @ApiPropertyOptional({ description: 'Student ID bo‘yicha filter' })
    @IsOptional()
    @IsNumberString()
    studentId?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    limit?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    page?: string;
  }
  