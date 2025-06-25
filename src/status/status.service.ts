import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusQueryDto } from './dto/status-query.dto';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStatusDto) {
    try {
      return await this.prisma.status.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: StatusQueryDto) {
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
        this.prisma.status.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take,
        }),
        this.prisma.status.count({ where }),
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
    const status = await this.prisma.status.findUnique({ where: { id } });
    if (!status) throw new NotFoundException({message: 'Status topilmadi'});
    return status;
  }

  async update(id: number, dto: UpdateStatusDto) {
    try {
      await this.findOne(id);
      return await this.prisma.status.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.status.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
