import { Module } from '@nestjs/common';
import { TeacherService } from './teachers.service';
import { TeachersController } from './teachers.controller';

@Module({
  controllers: [TeachersController],
  providers: [TeacherService],
})
export class TeachersModule {}
