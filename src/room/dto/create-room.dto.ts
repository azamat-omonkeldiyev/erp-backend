import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room A1', description: 'Xona nomi' })
  @IsString()
  name: string;
}
