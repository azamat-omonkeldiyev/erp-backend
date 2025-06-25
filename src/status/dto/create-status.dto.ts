import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ example: 'Active', description: 'Status nomi' })
  @IsString()
  name: string;
}