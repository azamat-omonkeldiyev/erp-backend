import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkListQueryDto } from './dto/work-list-query.dto';
import { CreateWorkListDto } from './dto/create-work-list.dto';
import { UpdateWorkListDto } from './dto/update-work-list.dto';

@Injectable()
export class WorkListService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkListDto) {
    try {
      return await this.prisma.workList.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: WorkListQueryDto) {
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
        this.prisma.workList.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take,
        }),
        this.prisma.workList.count({ where }),
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
    const item = await this.prisma.workList.findUnique({ where: { id } });
    if (!item) throw new NotFoundException({message: 'Topilmadi'});
    return item;
  }

  async update(id: number, dto: UpdateWorkListDto) {
    try {
      await this.findOne(id);
      return await this.prisma.workList.update({ where: { id }, data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.workList.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
