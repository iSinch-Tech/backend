import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(pagination: PaginationDto, filter: FilterCategoryDto = {}) {
    const where = prepareFilter(filter) as Prisma.CategoryWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.category.count({
        where,
      }),
      this.prisma.category.findMany({
        where,
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

  findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existCategory = await this.findById(id);
    if (existCategory === null) {
      throw new NotFoundException();
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
