import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsInt() stackId: number;
  @ApiProperty() @IsInt() roomId: number;
  @ApiProperty() @IsBoolean() status: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional() @IsArray() mainTeacherIds?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional() @IsArray() supportTeacherIds?: string[];
}
