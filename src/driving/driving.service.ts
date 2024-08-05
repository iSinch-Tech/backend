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
  trainerId: true,
  date: true,
  status: true,
  comment: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  trainer: {
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
    createCellDto.userId = createCellDto.userId ?? null;
    return this.prisma.driveSchedule.create({
      data: createCellDto,
    });
  }

  findOne(id: number) {
    return this.prisma.driveSchedule.findUnique({
      where: { id },
    });
  }

  findAll(filter: FilterCellDto = {}) {
    const where = prepareFilter(filter) as Prisma.DriveScheduleWhereInput;

    return this.prisma.driveSchedule.findMany({
      where,
      select: SELECT_SCHEME,
    });
  }

  async takeCell(cellId: number, userId: number) {
    const isUserExist =
      (await this.prisma.driveSchedule.count({
        where: {
          userId,
          status: RecordStatus.OPEN,
        },
      })) > 0;
    if (isUserExist) {
      throw new BadRequestException('An entry already exists for you');
    }

    const isCellAvailable =
      (await this.prisma.driveSchedule.count({
        where: {
          id: cellId,
          userId: null,
          status: RecordStatus.OPEN,
        },
      })) === 1;
    if (!isCellAvailable) {
      throw new BadRequestException('An entry already taken');
    }

    return this.prisma.driveSchedule.update({
      where: { id: cellId },
      data: { userId },
      select: SELECT_SCHEME,
    });
  }

  update(id: number, updateCellDto: UpdateCellDto) {
    return this.prisma.driveSchedule.update({
      where: { id },
      data: updateCellDto,
      select: SELECT_SCHEME,
    });
  }

  remove(id: number) {
    return this.prisma.driveSchedule.delete({
      where: { id },
    });
  }
}
