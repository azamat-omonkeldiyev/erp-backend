import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateWorkListDto {
  @ApiProperty({ example: 'Najot ta\'lim', description: 'Ish ro‘yxati nomi' })
  @IsString()
  name: string;
}