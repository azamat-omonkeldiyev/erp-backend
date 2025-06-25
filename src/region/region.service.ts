import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegionQueryDto } from './dto/region-query.dto';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRegionDto) {
    try {
      return await this.prisma.region.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: RegionQueryDto) {
    try {
      const {
        name,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        limit = '10',
        page = '1',
      } = query;

      const take = parseInt(limit);
      const skip = (parseInt(page) - 1) * take;

      const where: any = {};
      if (name) where.name = { contains: name, mode: 'insensitive' };

      const [data, total] = await this.prisma.$transaction([
        this.prisma.region.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take,
        }),
        this.prisma.region.count({ where }),
      ]);

      return {
        data,
        total,
        page: parseInt(page),
        lastPage: Math.ceil(total / take),
      };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findOne(id: number) {
    try {
      const region = await this.prisma.region.findUnique({ where: { id } });
      if (!region) throw new NotFoundException({message: 'Region topilmadi'});
      return region;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, dto: UpdateRegionDto) {
    try {
      await this.findOne(id);
      return await this.prisma.region.update({ where: { id }, data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.region.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
