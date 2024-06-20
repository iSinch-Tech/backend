import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPartnerDto } from './dto/filter-partner.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partner.create({
      data: createPartnerDto,
    });
  }

  async findAll(pagination: PaginationDto, filter: FilterPartnerDto = {}) {
    const where = prepareFilter(filter) as Prisma.PartnerWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.partner.count({
        where,
      }),
      this.prisma.partner.findMany({
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

  findOne(id: number) {
    return this.prisma.partner.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePartnerDto: UpdatePartnerDto) {
    // TODO delete old file
    return this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  remove(id: number) {
    // TODO delete file
    return this.prisma.partner.delete({
      where: { id },
    });
  }
}
