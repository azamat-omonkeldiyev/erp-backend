import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupQueryDto } from './dto/groups-query.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateGroupDto) {
    const { stackId, roomId, mainTeacherIds = [], supportTeacherIds = [] } = dto;
  
    const [stack, room] = await Promise.all([
      this.prisma.stack.findUnique({ where: { id: stackId } }),
      this.prisma.room.findUnique({ where: { id: roomId } }),
    ]);
    if (!stack || !room) throw new NotFoundException({message: 'Stack yoki Room topilmadi'});
  
    const allTeacherIds = [...mainTeacherIds, ...supportTeacherIds];
    const foundTeachers = await this.prisma.teachers.findMany({
      where: { id: { in: allTeacherIds } },
      select: { id: true },
    });
    const foundIds = foundTeachers.map((t) => t.id);
  
    const notFound = allTeacherIds.filter(id => !foundIds.includes(id));
    if (notFound.length) throw new NotFoundException({message: `Ushbu teacherIdlar topilmadi: ${notFound.join(', ')}`});
  
    return this.prisma.group.create({
      data: {
        name: dto.name,
        stackId,
        roomId,
        status: dto.status,
        mainTeachers: {
          connect: mainTeacherIds.map(id => ({ id })),
        },
        supportTeachers: {
          connect: supportTeacherIds.map(id => ({ id })),
        },
      },
      include: {
        stack: true,
        room: true,
        mainTeachers: true,
        supportTeachers: true,
      },
    });
  }
  
  
  async findAll(query: GroupQueryDto) {
    const {
      name,
      stackId,
      roomId,
      mainTeacherId,
      mainTeacherName,
      supportTeacherId,
      supportTeacherName,
      page = '1',
      limit = '10',
    } = query;
  
    const where: any = {};
  
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (stackId) where.stackId = +stackId;
    if (roomId) where.roomId = +roomId;
  
    if (mainTeacherId || mainTeacherName) {
      where.mainTeachers = {
        some: {
          ...(mainTeacherId && { id: mainTeacherId }),
          ...(mainTeacherName && { name: { contains: mainTeacherName, mode: 'insensitive' } }),
        },
      };
    }
  
    if (supportTeacherId || supportTeacherName) {
      where.supportTeachers = {
        some: {
          ...(supportTeacherId && { id: supportTeacherId }),
          ...(supportTeacherName && { name: { contains: supportTeacherName, mode: 'insensitive' } }),
        },
      };
    }
  
    const total = await this.prisma.group.count({ where });
  
    const data = await this.prisma.group.findMany({
      where,
      skip: (+page - 1) * +limit,
      take: +limit,
      orderBy: { createdAt: 'desc' },
      include: {
        stack: true,
        room: true,
      },
    });
  
    return {
      data,
      meta: {
        total,
        page: +page,
        lastPage: Math.ceil(total / +limit),
      },
    };
  }
  
  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        stack: true,
        room: true,
        Students: true,
        mainTeachers: true,
        supportTeachers: true,
      },
    });
  
    if (!group) throw new NotFoundException({message: 'Group topilmadi'});
    return group;
  }
  
  async update(id: number, dto: UpdateGroupDto) {
    const exists = await this.prisma.group.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException({message: 'Group topilmadi'});
  
    return this.prisma.group.update({
      where: { id },
      data: dto,
    });
  }
  
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.group.delete({ where: { id } });
  }
  
}
