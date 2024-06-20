import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TicketsModule } from 'src/tickets/tickets.module';
import { TopicsModule } from 'src/topics/topics.module';
import { ExamsModule } from 'src/exams/exams.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ExamsModule, TicketsModule, TopicsModule, UsersModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
