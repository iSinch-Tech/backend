import { Injectable } from '@nestjs/common';
import { TicketsService } from 'src/tickets/tickets.service';
import { TopicsService } from 'src/topics/topics.service';
import { UserStatistics } from './dto/user-statistics.dto';
import { ExamsService } from 'src/exams/exams.service';
import { ExamStatus, ExamType } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StatisticsService {
  constructor(
    private examsService: ExamsService,
    private ticketsService: TicketsService,
    private topicsService: TopicsService,
    private usersService: UsersService,
  ) {}

  async userStatistics(userId: number): Promise<UserStatistics | null> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return null;
    }
    const { rows } = await this.examsService.findAll({ userId });

    const ticketsCompleted = new Set();
    let ticketsStarted = 0;
    const topicsCompleted = new Set();
    let topicsStarted = 0;

    rows.forEach((exam) => {
      switch (exam.type) {
        case ExamType.TICKET:
          if (exam.status === ExamStatus.PASSED) {
            ticketsCompleted.add(exam.entityId);
          }
          ticketsStarted++;
          break;
        case ExamType.TOPIC:
          if (exam.status === ExamStatus.PASSED) {
            topicsCompleted.add(exam.entityId);
          }
          topicsStarted++;
          break;
      }
    });

    return {
      ticketsCompleted: ticketsCompleted.size,
      ticketsStarted: ticketsStarted,
      topicsCompleted: topicsCompleted.size,
      topicsStarted: topicsStarted,
      ticketsCount: await this.ticketsService.total({
        categoryId: user.categoryId,
      }),
      topicsCount: await this.topicsService.total(),
    };
  }
}
