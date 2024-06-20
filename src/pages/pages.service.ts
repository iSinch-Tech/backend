import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPageDto } from './dto/filter-page.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { Prisma } from '@prisma/client';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  create(createPageDto: CreatePageDto) {
    return this.prisma.page.create({
      data: createPageDto,
    });
  }

  async findAll(pagination: PaginationDto, filter: FilterPageDto = {}) {
    const where = prepareFilter(filter) as Prisma.PageWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.page.count({
        where,
      }),
      this.prisma.page.findMany({
        where,
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true,
        },
        skip: pagination.offset,
        take: pagination.limit,
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

  findOne(id: number) {
    return this.prisma.page.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePageDto: UpdatePageDto) {
    return this.prisma.page.update({
      where: { id },
      data: updatePageDto,
    });
  }

  remove(id: number) {
    return this.prisma.page.delete({
      where: { id },
    });
  }
}
