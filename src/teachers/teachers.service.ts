import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeacherQueryDto } from './dto/teacher-query.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeacherDto) {
    const {
      stackId,
      regionId,
      statusId,
      workCompanyIds,
      ...data
    } = dto;
  
    const [stack, region, status] = await Promise.all([
      this.prisma.stack.findUnique({ where: { id: stackId } }),
      this.prisma.region.findUnique({ where: { id: regionId } }),
      this.prisma.status.findUnique({ where: { id: statusId } }),
    ]);
  
    if (!stack) throw new NotFoundException({message: 'Stack topilmadi'});
    if (!region) throw new NotFoundException({message: 'Region topilmadi'});
    if (!status) throw new NotFoundException({message: 'Status topilmadi'});
  
    for (const id of workCompanyIds) {
      const exists = await this.prisma.workList.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException({message: `WorkCompany ID ${id} topilmadi`});
    }
  
    try {
      return this.prisma.teachers.create({
        data: {
          ...data,
          stackId,
          regionId,
          statusId,
          workCompanies: {
            create: workCompanyIds.map((id) => ({
              workCompany: { connect: { id } },
            })),
          },
        },
        include: {
          workCompanies: {
            include: { workCompany: true },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
  

  async findAll(query: TeacherQueryDto) {
    const {
      stackId,
      regionId,
      statusId,
      groupId,
      groupName,
      name,
      surname,
      workCompanyId,
      page = '1',
      limit = '10',
      order = 'desc',
      orderBy = 'createdAt',
    } = query;
  
    const where: any = {};
  
    if (stackId) where.stackId = +stackId;
    if (regionId) where.regionId = +regionId;
    if (statusId) where.statusId = +statusId;
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (surname) where.surname = { contains: surname, mode: 'insensitive' };
  
    if (groupId) {
      where.OR = [
        { mainGroups: { some: { id: +groupId } } },
        { supportGroups: { some: { id: +groupId } } },
      ];
    }
  
    if (groupName) {
      where.OR = [
        { mainGroups: { some: { name: { contains: groupName, mode: 'insensitive' } } } },
        { supportGroups: { some: { name: { contains: groupName, mode: 'insensitive' } } } },
      ];
    }
  
    if (workCompanyId) {
      where.workCompanies = {
        some: { workCompanyId: +workCompanyId },
      };
    }
  
    const total = await this.prisma.teachers.count({ where });
  
    const teachers = await this.prisma.teachers.findMany({
      where,
      include: {
        stack: true,
        region: true,
        status: true,
        workCompanies: {
          include: { workCompany: true },
        },
      },
      orderBy: {
        [orderBy]: order,
      },
      take: +limit,
      skip: (+page - 1) * +limit,
    });
  
    return {
      data: teachers,
      meta: {
        total,
        page: +page,
        lastPage: Math.ceil(total / +limit),
      },
    };
  }
  

  async findOne(id: string) {
    const teacher = await this.prisma.teachers.findUnique({
      where: { id },
      include: {
        stack: true,
        region: true,
        status: true,
        workCompanies: {
          include: { workCompany: true },
        },
      },
    });

    if (!teacher) throw new NotFoundException({message: 'Ustoz topilmadi'});
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    await this.findOne(id);

    try {
      return await this.prisma.teachers.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prisma.teachers.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
