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
import { StatusService } from './status.service';
import { StatusQueryDto } from './dto/status-query.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Yangi status yaratish' })
  create(@Body() dto: CreateStatusDto) {
    return this.statusService.create(dto);
  }


  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Statuslar ro‘yxati (filter, sort, pagination)' })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['id', 'name', 'createdAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  findAll(@Query() query: StatusQueryDto) {
    return this.statusService.findAll(query);
  }

 
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Statusni ko‘rish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.findOne(id);
  }


  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Statusni qisman yangilash (PATCH)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
    return this.statusService.update(id, dto);
  }


  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Statusni o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.remove(id);
  }
}
