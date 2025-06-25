import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateStackDto {
  @ApiProperty({ example: 'NestJS', description: 'Stack nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://example.com/logo.png', description: 'Stack rasmi URL' })
  @IsString()
  image: string;
}