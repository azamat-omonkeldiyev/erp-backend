import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GroupQueryDto } from './dto/groups-query.dto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Yangi group yaratish' })
  create(@Body() dto: CreateGroupDto) {
    return this.service.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Group ro‘yxati (teacher boyicha filterlar bilan)' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'stackId', required: false })
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'mainTeacherId', required: false })
  @ApiQuery({ name: 'mainTeacherName', required: false })
  @ApiQuery({ name: 'supportTeacherId', required: false })
  @ApiQuery({ name: 'supportTeacherName', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: GroupQueryDto) {
    return this.service.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Groupni olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Groupni yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.service.update(+id, dto);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Groupni o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
