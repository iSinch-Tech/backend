import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCellDto } from './dto/create-cell.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { Prisma, RecordStatus } from '@prisma/client';
import { FilterCellDto } from './dto/filter-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';

const SELECT_SCHEME = {
  id: true,
  userId: true,
  date: true,
  status: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class DrivingService {
  constructor(private prisma: PrismaService) {}

  create(createCellDto: CreateCellDto) {
    const data = [...Array(createCellDto.count ?? 1)].map(() => {
      const year = createCellDto.date.getFullYear();
      const month = String(createCellDto.date.getMonth() + 1).padStart(2, '0');
      const day = String(createCellDto.date.getDate()).padStart(2, '0');
      return {
        date: `${year}-${month}-${day}`,
      };
    });
    return this.prisma.schedule.createMany({
      data,
    });
  }

  findOne(id: number) {
    return this.prisma.schedule.findUnique({
      where: { id },
    });
  }

  findAll(filter: FilterCellDto = {}) {
    const where = prepareFilter(filter) as Prisma.ScheduleWhereInput;

    return this.prisma.schedule.findMany({
      where,
      select: SELECT_SCHEME,
    });
  }

  async takeCell(cellId: number, userId: number) {
    const isUserExist =
      (await this.prisma.schedule.count({
        where: {
          userId,
          status: RecordStatus.OPEN,
        },
      })) > 0;
    if (isUserExist) {
      throw new BadRequestException('An entry already exists for you');
    }

    const isCellAvailable =
      (await this.prisma.schedule.count({
        where: {
          id: cellId,
          userId: null,
          status: RecordStatus.OPEN,
        },
      })) === 1;
    if (!isCellAvailable) {
      throw new BadRequestException('An entry already taken');
    }

    return this.prisma.schedule.update({
      where: { id: cellId },
      data: { userId },
      select: SELECT_SCHEME,
    });
  }

  update(id: number, updateCellDto: UpdateCellDto) {
    return this.prisma.schedule.update({
      where: { id },
      data: updateCellDto,
      select: SELECT_SCHEME,
    });
  }

  remove(id: number) {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}
