import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    const { questions, ...data } = createTicketDto;

    const ticket = await this.prisma.ticket.create({ data });

    this.prisma.ticketQuestion.createMany({
      data: (questions || []).map((questionId) => ({
        questionId,
        ticketId: ticket.id,
      })),
      skipDuplicates: true,
    });

    return ticket;
  }

  async findAll(filter: FilterTicketDto = {}, pagination?: PaginationDto) {
    const where = prepareFilter(filter) as Prisma.TicketWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.ticket.count({
        where,
      }),
      this.prisma.ticket.findMany({
        where,
        include: {
          category: true,
        },
        ...(!pagination
          ? {}
          : {
              skip: +pagination.offset,
              take: +pagination.limit,
              orderBy: {
                [pagination.orderBy]: pagination.orderType,
              },
            }),
      }),
    ]);
    return {
      rows,
      count,
    };
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            question: true,
          },
        },
        category: true,
      },
    });

    if (ticket === null) {
      return null;
    }

    return {
      ...ticket,
      questions: ticket.questions.map((q) => q.question),
    };
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const existEntity = await this.findOne(id);
    if (existEntity === null) {
      throw new NotFoundException();
    }

    const { questions, ...data } = updateTicketDto;

    const ticket = await this.prisma.ticket.update({
      where: { id },
      data,
    });

    if (questions) {
      this.prisma.$transaction([
        this.prisma.ticketQuestion.deleteMany({
          where: { ticketId: ticket.id },
        }),
        this.prisma.ticketQuestion.createMany({
          data: questions.map((questionId) => ({
            questionId,
            ticketId: ticket.id,
          })),
          skipDuplicates: true,
        }),
      ]);
    }

    return ticket;
  }

  remove(id: number) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  total(filter = {}) {
    return this.prisma.ticket.count({ where: filter });
  }
}
