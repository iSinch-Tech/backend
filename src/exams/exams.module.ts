import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  imports: [PrismaModule, QuestionsModule, TicketsModule, TopicsModule],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
