import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCellDto } from './dto/create-cell.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { Prisma, RecordStatus, UserRole } from '@prisma/client';
import { FilterCellDto } from './dto/filter-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
import { DateTime, Interval } from 'luxon';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

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

const START_TIME = { hour: 9, minute: 0 };
const END_TIME = { hour: 21, minute: 0 };
const DURATOIN = { hour: 1 };

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

  findByMonth(month: string, filter: FilterCellDto = {}) {
    const baseDate = DateTime.fromISO(`${month}-01T00:00:00.00`, {
      zone: 'utc',
    });

    return this.prisma.driveSchedule.findMany({
      where: {
        date: {
          gte: baseDate.startOf('month').toISO(),
          lte: baseDate.endOf('month').toISO(),
        },
        ...prepareFilter(filter),
      },
    });
  }

  async takeCell(cellId: number, user: AuthUserDto) {
    const cell = await this.findOne(cellId);

    if (!cell) {
      throw new NotFoundException();
    }
    if (cell.userId !== null || cell.status !== RecordStatus.OPEN) {
      throw new BadRequestException('An entry already taken');
    }
    if (cell.trainerId !== user.trainerId) {
      throw new BadRequestException('Not your trainer');
    }

    return this.prisma.driveSchedule.update({
      where: { id: cellId },
      data: { userId: user.id },
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

  async generate(month: string) {
    const cells = await this.findByMonth(month);

    if (cells.length) {
      return cells;
    }

    const trainers = await this.prisma.user.findMany({
      where: {
        role: UserRole.TRAINER,
      },
    });
    const baseDate = DateTime.fromISO(`${month}-01T00:00:00.00`, {
      zone: 'utc',
    });

    const data: CreateCellDto[] = [];
    Interval.fromDateTimes(baseDate.startOf('month'), baseDate.endOf('month'))
      .splitBy({ days: 1 })
      .forEach(({ start: date }) => {
        let d = date.set(START_TIME);
        const endDate = date.set(END_TIME);
        while (d <= endDate) {
          trainers.forEach(({ id: trainerId }) => {
            data.push({
              date: d.toISO(),
              trainerId,
              userId: null,
              status: RecordStatus.OPEN,
            });
          });
          d = d.plus(DURATOIN);
        }
      });

    await this.prisma.driveSchedule.createMany({ data });

    return this.findByMonth(month);
  }
}
