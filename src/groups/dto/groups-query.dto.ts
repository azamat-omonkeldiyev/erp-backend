import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GroupQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumberString() stackId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumberString() roomId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mainTeacherId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mainTeacherName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supportTeacherId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supportTeacherName?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumberString() page?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumberString() limit?: string;
}
