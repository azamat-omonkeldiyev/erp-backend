import { Module } from '@nestjs/common';
import { WorkListService } from './work-list.service';
import { WorkListController } from './work-list.controller';

@Module({
  controllers: [WorkListController],
  providers: [WorkListService],
})
export class WorkListModule {}
