import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkListService } from './work-list.service';
import { WorkListQueryDto } from './dto/work-list-query.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateWorkListDto } from './dto/create-work-list.dto';
import { UpdateWorkListDto } from './dto/update-work-list.dto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Work List')
@Controller('work-lists')
export class WorkListController {
  constructor(private readonly service: WorkListService) {}

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Yangi work list yaratish' })
  create(@Body() dto: CreateWorkListDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Work list ro‘yxati (filter, sort, pagination)' })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['id', 'name', 'createdAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  findAll(@Query() query: WorkListQueryDto) {
    return this.service.findAll(query);
  }

  
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Bitta work listni olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Work listni yangilash (PATCH)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWorkListDto) {
    return this.service.update(id, dto);
  }


  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Work listni o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
