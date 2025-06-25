import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomQueryDto } from './dto/room-query.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    try {
      return await this.prisma.room.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: RoomQueryDto) {
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
        this.prisma.room.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take,
        }),
        this.prisma.room.count({ where }),
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
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException({message: 'Xona topilmadi'});
    return room;
  }

  async update(id: number, dto: UpdateRoomDto) {
    try {
      await this.findOne(id);
      return await this.prisma.room.update({ where: { id }, data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.room.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
