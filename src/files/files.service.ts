import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterFileDto } from './dto/filter-file.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { Prisma } from '@prisma/client';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  create(file: Express.Multer.File, userId: number) {
    return this.prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        isPublic: false,
        path: file.path,
        userId,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.file.findUnique({
      where: { id },
    });
  }

  async findAll(
    pagination: PaginationDto,
    filter: FilterFileDto = {},
    select = {
      id: true,
      name: true,
      type: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  ) {
    filter = prepareFilter(filter);
    const where = prepareFilter(filter) as Prisma.FileWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.file.count({
        where,
      }),
      this.prisma.file.findMany({
        where,
        select,
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

  update(id: number, updateFileDto: UpdateFileDto) {
    return this.prisma.file.update({
      where: { id },
      data: updateFileDto,
    });
  }

  remove(id: number) {
    return this.prisma.file.delete({ where: { id } });
  }
}
