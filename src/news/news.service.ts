import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterNewsDto } from './dto/filter-news.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';
import { Prisma } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto) {
    const { title, description, images } = createNewsDto;
    const news = await this.prisma.news.create({
      data: {
        title,
        description,
      },
    });

    await this.prisma.newsFile.createMany({
      data: (images || []).map((fileId) => ({
        fileId,
        newsId: news.id,
      })),
    });

    return this.findOne(news.id);
  }

  async findAll(pagination: PaginationDto, filter: FilterNewsDto = {}) {
    const where = prepareFilter(filter) as Prisma.NewsWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.news.count({
        where,
      }),
      this.prisma.news.findMany({
        where,
        include: {
          images: true,
        },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: {
          [pagination.orderBy]: pagination.orderType,
        },
      }),
    ]);
    return {
      rows: rows.map((it) => ({
        ...it,
        images: it.images.map((f) => f.fileId),
      })),
      count,
    };
  }

  async findOne(id: number) {
    const entity = await this.prisma.news.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!entity) {
      throw new NotFoundException();
    }

    const { images, ...news } = entity;

    return {
      ...news,
      images: images.map((f) => f.fileId),
    };
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const { images, ...data } = updateNewsDto;
    const news = await this.prisma.news.update({
      where: { id },
      data,
    });

    if (images?.length) {
      // TODO delete files
      this.prisma.$transaction([
        this.prisma.newsFile.deleteMany({
          where: { newsId: news.id },
        }),
        this.prisma.newsFile.createMany({
          data: images.map((fileId) => ({
            fileId,
            newsId: news.id,
          })),
          skipDuplicates: true,
        }),
      ]);
    }

    return this.findOne(news.id);
  }

  remove(id: number) {
    // TODO delete files
    return this.prisma.news.delete({
      where: { id },
    });
  }
}
