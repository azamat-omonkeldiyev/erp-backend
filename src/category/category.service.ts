import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: CategoryQueryDto) {
    try {
      const {
        title,
        path,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        limit = '10',
        page = '1',
      } = query;
  
      const take = parseInt(limit);
      const skip = (parseInt(page) - 1) * take;
  
      const where: any = {};
      if (title) where.title = { contains: title, mode: 'insensitive' };
      if (path) where.path = { contains: path, mode: 'insensitive' };
  
      const [data, total] = await this.prisma.$transaction([
        this.prisma.category.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take,
        }),
        this.prisma.category.count({ where }),
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
      const category = await this.prisma.category.findUnique({ where: { id } });
      if (!category) throw new NotFoundException({message: 'Kategoriya topilmadi'});
      return category;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async update(id: number, dto: UpdateCategoryDto) {
    try {
      await this.findOne(id); // mavjudligini tekshiradi
      return await this.prisma.category.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id); // mavjudligini tekshiradi
      return await this.prisma.category.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
