import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StackQueryDto } from './dto/stack-query.dto';
import { CreateStackDto } from './dto/create-stack.dto';
import { UpdateStackDto } from './dto/update-stack.dto';

@Injectable()
export class StackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStackDto) {
    try {
      return await this.prisma.stack.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: StackQueryDto) {
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
        this.prisma.stack.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take,
        }),
        this.prisma.stack.count({ where }),
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
      const stack = await this.prisma.stack.findUnique({ where: { id } });
      if (!stack) throw new NotFoundException({message: 'Stack topilmadi'});
      return stack;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, dto: UpdateStackDto) {
    try {
      await this.findOne(id);
      return await this.prisma.stack.update({
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
      return await this.prisma.stack.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
