import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Question } from '@prisma/client';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FilterQuestionDto } from './dto/filter-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  create(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: createQuestionDto,
    });
  }

  async findAll(pagination: PaginationDto, filter: FilterQuestionDto = {}) {
    const where = prepareFilter(filter) as Prisma.QuestionWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.question.count({
        where,
      }),
      this.prisma.question.findMany({
        where,
        include: {
          category: true,
          tickets: {
            include: {
              ticket: true,
            },
          },
          topics: {
            include: {
              topic: true,
            },
          },
        },
        skip: +pagination.offset,
        take: +pagination.limit,
        orderBy: {
          [pagination.orderBy]: pagination.orderType,
        },
      }),
    ]);
    return {
      rows: rows.map((q) => ({
        ...q,
        tickets: q.tickets.map((it) => it.ticket),
        topics: q.topics.map((it) => it.topic),
      })),
      count,
    };
  }

  async findRandom(limit: number, where: string) {
    const data = (await this.prisma.$queryRawUnsafe(
      `SELECT * FROM "Question" WHERE ${where} ORDER BY RANDOM() LIMIT ${limit};`,
    )) as Question[];
    return data;
  }

  findOne(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  async getByIds(ids: number[]) {
    return this.prisma.question.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const existEntity = await this.findOne(id);
    if (existEntity === null) {
      throw new NotFoundException();
    }
    // TODO delete old files
    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  remove(id: number) {
    // TODO delete files
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
