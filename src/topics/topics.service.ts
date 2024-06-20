import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/dto/pagination.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { FilterTopicDto } from './dto/filter-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async create(createTopicDto: CreateTopicDto) {
    const { questions, ...data } = createTopicDto;

    const topic = await this.prisma.topic.create({ data });

    this.prisma.topicQuestion.createMany({
      data: (questions || []).map((questionId) => ({
        questionId,
        topicId: topic.id,
      })),
    });

    return topic;
  }

  async findAll(filter: FilterTopicDto = {}, pagination?: PaginationDto) {
    const where = prepareFilter(filter) as Prisma.TopicWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.topic.count({
        where,
      }),
      this.prisma.topic.findMany({
        where,
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
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            question: true,
          },
        },
      },
    });

    if (topic === null) {
      return null;
    }

    return {
      ...topic,
      questions: topic.questions.map((q) => q.question),
    };
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    const existEntity = await this.findOne(id);
    if (existEntity === null) {
      throw new NotFoundException();
    }

    const { questions, ...data } = updateTopicDto;

    const topic = await this.prisma.topic.update({
      where: { id },
      data,
    });

    if (questions) {
      this.prisma.$transaction([
        this.prisma.topicQuestion.deleteMany({
          where: { topicId: topic.id },
        }),
        this.prisma.topicQuestion.createMany({
          data: questions.map((questionId) => ({
            questionId,
            topicId: topic.id,
          })),
        }),
      ]);
    }

    return topic;
  }

  remove(id: number) {
    return this.prisma.topic.delete({
      where: { id },
    });
  }

  total(filter = {}) {
    return this.prisma.topic.count({ where: filter });
  }
}
