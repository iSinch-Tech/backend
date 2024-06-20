import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { userScheme } from './utils/schemes';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.findByLogin(createUserDto.login);
    if (existUser !== null) {
      throw new BadRequestException('Error.UserExists');
    }

    const { password, ...data } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash: await bcrypt.hash(password, 10),
        phone: createUserDto.phone?.replace(/[^0-9]/g, ''),
      },
    });
  }

  findByLogin(login: string) {
    return this.prisma.user.findUnique({
      where: { login },
      include: {
        category: true,
      },
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...userScheme,
        category: true,
      },
    });
  }

  async findAll(pagination: PaginationDto, filter: FilterUserDto = {}) {
    const where = prepareFilter(filter) as Prisma.UserWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.user.count({
        where,
      }),
      this.prisma.user.findMany({
        where,
        select: {
          ...userScheme,
          category: true,
        },
        skip: +pagination.offset,
        take: +pagination.limit,
        orderBy: {
          [pagination.orderBy]: pagination.orderType,
        },
      }),
    ]);
    return {
      rows,
      count,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existUser = await this.findById(id);
    if (existUser === null) {
      throw new NotFoundException();
    }

    if (updateUserDto.firebaseToken === null) {
      updateUserDto.firebaseToken = undefined;
    }

    // TODO delete old file
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: userScheme,
    });
  }

  remove(id: number) {
    // TODO delete file
    return this.prisma.user.delete({
      where: { id },
      select: userScheme,
    });
  }
}
