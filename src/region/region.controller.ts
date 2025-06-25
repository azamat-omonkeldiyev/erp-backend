import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionQueryDto } from './dto/region-query.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Region')
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Yangi region yaratish' })
  async create(@Body() dto: CreateRegionDto) {
    return this.regionService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Regionlar ro‘yxati (filter, sort, pagination)' })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['id', 'name', 'createdAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  async findAll(@Query() query: RegionQueryDto) {
    return this.regionService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Regionni ko‘rish' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.regionService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Regionni qisman yangilash (PATCH)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegionDto,
  ) {
    return this.regionService.update(id, dto);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Regionni o‘chirish' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.regionService.remove(id);
  }
}
