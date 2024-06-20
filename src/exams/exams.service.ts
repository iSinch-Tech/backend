import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamStatus, ExamType, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionsService } from 'src/questions/questions.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { TopicsService } from 'src/topics/topics.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { FilterExamDto } from './dto/filter-exam.dto';
import { userScheme } from 'src/users/utils/schemes';
import { AnswersExamDto } from './dto/answer-exam.dto';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private ticketsService: TicketsService,
    private topicsService: TopicsService,
    private questionsService: QuestionsService,
  ) {}

  async create(createExamDto: CreateExamDto, user: AuthUserDto) {
    const exam = await this.prisma.exam.create({ data: createExamDto });

    let questions;
    switch (exam.type) {
      case ExamType.TICKET:
        if (exam.entityId) {
          const ticket = await this.ticketsService.findOne(exam.entityId);
          if (ticket) {
            questions = ticket.questions.map((q) => q.id);
          }
        }
        break;
      case ExamType.TOPIC:
        if (exam.entityId) {
          const topic = await this.topicsService.findOne(exam.entityId);
          if (topic) {
            questions = topic.questions.map((q) => q.id);
          }
        }
        break;
      case ExamType.EXAM:
        const pagination = new PaginationDto();
        pagination.limit = 20;
        const rows = await this.questionsService.findRandom(
          pagination.limit,
          `"Question"."categoryId"=${user.category.id}`,
        );
        if (rows) {
          questions = rows.map((q) => q.id);
        }
        break;
    }

    await this.prisma.examQuestion.createMany({
      data: (questions || []).map((questionId) => ({
        questionId,
        examId: exam.id,
      })),
    });

    return this.findOne(exam.id);
  }

  async findAll(filter: FilterExamDto = {}, pagination?: PaginationDto) {
    const where = prepareFilter(filter) as Prisma.ExamWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.exam.count({
        where,
      }),
      this.prisma.exam.findMany({
        where,
        include: {
          questions: {
            select: {
              question: true,
            },
          },
          user: {
            select: userScheme,
          },
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

    const ids: Record<string, Set<number>> = rows.reduce((acc, it) => {
      acc[it.type]
        ? acc[it.type].add(it.entityId)
        : (acc[it.type] = new Set([it.entityId]));
      return acc;
    }, {});

    const entities = {};
    const promises: Promise<Record<string, any>>[] = [];

    Object.entries(ids).forEach(
      ([entityType, entityIds]: [string, Set<number>]) => {
        switch (entityType) {
          case ExamType.TICKET:
            promises.push(
              this.ticketsService
                .findAll({ id: [...entityIds] })
                .then(({ rows }) => (entities[entityType] = rows)),
            );
            break;
          case ExamType.TOPIC:
            promises.push(
              this.topicsService
                .findAll({ id: [...entityIds] })
                .then(({ rows }) => (entities[entityType] = rows)),
            );
            break;
        }
      },
    );

    await Promise.all(promises);

    return {
      count,
      rows: rows.map((it) => {
        const entity = entities[it.type]?.find(
          (entity) => entity.id === it.entityId,
        );

        return {
          ...it,
          entity: entity || 'Экзамен',
          questions: it.questions.map((q) => q.question),
        };
      }),
    };
  }

  async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            question: true,
          },
        },
        user: {
          select: userScheme,
        },
      },
    });

    if (exam === null) {
      return null;
    }

    return {
      ...exam,
      questions: exam.questions.map((q) => q.question),
    };
  }

  remove(id: number) {
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async saveAnswer(userId: number, id: number, examResult: AnswersExamDto) {
    const exam = await this.findOne(id);

    if (exam === null || exam.userId !== userId) {
      throw new NotFoundException();
    }

    const answers = examResult.answers.map((answer) => {
      const question = exam.questions.find((q) => q.id === answer.questionId);
      let isRight = false;
      if (question) {
        isRight =
          !!(
            (question.answers as Prisma.JsonArray).find(
              (a) => (a as Prisma.JsonObject).id === answer.answerId,
            ) as Prisma.JsonObject
          )?.isRight ?? false;
      }
      return {
        ...answer,
        isRight,
      };
    });

    const data = {
      answers,
      time: examResult.time,
      status:
        answers.some((a) => !a.isRight) ||
        examResult.answers.length < exam.questions.length
          ? ExamStatus.FAILED
          : ExamStatus.PASSED,
    };

    return this.prisma.exam.update({
      where: { id },
      data,
    });
  }
}
