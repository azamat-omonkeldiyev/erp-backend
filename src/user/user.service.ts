import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { LoginUserDto } from './dto/loginUser.dto';
import { Request } from 'express';
import { RefreshTokenDto } from './dto/refreshtoken.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ){}

  genAccToken(payload:{id:string, role:string}):string{
    return this.jwt.sign(payload,{expiresIn:'7d'})
  }

  generateRefreshToken(payload:{id:string,role:string}):string {
    return this.jwt.sign(payload,{
      secret: process.env.TOKEN_KEY_REFRESH,
      expiresIn: '7d'
    })
  }
  
  verifyRefreshToken(tokenDto: RefreshTokenDto) {
    try {
      const data = this.jwt.verify(tokenDto.token, {
        secret: process.env.TOKEN_KEY_REFRESH,
      });
      const payload = { id: data.id, role: data.role };
      const accessToken = this.genAccToken(payload);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }



  
  async register(data: CreateUserDto) {
    try {

      let hash = bcrypt.hashSync(data.password, 10)
      
      let userName = await this.prisma.users.findFirst({where: {username: data.username}})
      if(userName){
        throw new BadRequestException({message: "Username already exist!"})
      }
      
      let newUser= await this.prisma.users.create({
        data: {...data, password: hash}
      })
      return newUser;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async login(data: LoginUserDto,req: Request) {
    try {

      let user = await this.prisma.users.findFirst({where: {username: data.username}})
      if(!user){
        throw new NotFoundException({message: "Username not found!"})
      }

      let isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new BadRequestException({message: 'Wrong creadentials!'});
      }

      let payload = { id: user.id, role: user.role };
      let accessToken = this.genAccToken(payload);
      let refreshToken = this.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message);
    }
  } 
  

  async me(id: string) {
    try {
      return await this.prisma.users.findFirst({
        where: { id }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(params: {
    page: number;
    limit: number;
    username?: string;
    role?: UserRole;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page,
      limit,
      username,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
  
    const skip = (Number(page) - 1) * Number(limit);
  
    const where: any = {};
  
    if (username) {
      where.fullname = { contains: username, mode: 'insensitive' };
    }
  
    if (role) {
      where.role = role;
    }
  
    try {
      const data = await this.prisma.users.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        }
      });
    
      const total = await this.prisma.users.count({ where });
    
      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
  

  async findOne(id: string) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { id },
      });
  
      if (!user) throw new NotFoundException({message: 'User not found'});
      return user;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  // ✅ UPDATE USER
  async update(id: string, dto: UpdateUserDto) {
    try {
     await this.findOne(id)
      return await this.prisma.users.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ✅ DELETE USER
  async remove(id: string) {
    try {
      await this.findOne(id)
      let user = await this.prisma.users.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
