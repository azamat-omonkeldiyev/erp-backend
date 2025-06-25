import { PartialType } from '@nestjs/swagger';
import { CreateWorkListDto } from './create-work-list.dto';

export class UpdateWorkListDto extends PartialType(CreateWorkListDto) {}
