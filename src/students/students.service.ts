import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentQueryDto } from './dto/students-query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';


@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const { groupId, regionId } = dto;
  
    try {
      const group = await this.prisma.group.findUnique({ where: { id: groupId } });
      if (!group) throw new NotFoundException({message: 'Group topilmadi'});
  
      const region = await this.prisma.region.findUnique({ where: { id: regionId } });
      if (!region) throw new NotFoundException({message: 'Region topilmadi'});
  
      return await this.prisma.student.create({ data: dto });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: StudentQueryDto) {
    try {
      const {
        name,
        surname,
        groupId,
        groupName,
        studentId,
        limit = '10',
        page = '1',
      } = query;

      const take = parseInt(limit);
      const skip = (parseInt(page) - 1) * take;

      const where: any = {};

      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (surname) where.surname = { contains: surname, mode: 'insensitive' };
      if (groupId) where.groupId = +groupId;
      if (studentId) where.studentId = +studentId;
      if (groupName) {
        where.group = { name: { contains: groupName, mode: 'insensitive' } };
      }

      const [data, total] = await this.prisma.$transaction([
        this.prisma.student.findMany({
          where,
          include: { group: true, region: true },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.student.count({ where }),
      ]);

      return {
        data,
        total,
        page: +page,
        lastPage: Math.ceil(total / take),
      };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { group: true, region: true },
    });

    if (!student) throw new NotFoundException({message: 'Talaba topilmadi'});
    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    try {
      await this.findOne(id);
      return await this.prisma.student.update({
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
      return await this.prisma.student.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
