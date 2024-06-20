import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TicketsModule } from './tickets/tickets.module';
import { QuestionsModule } from './questions/questions.module';
import { TopicsModule } from './topics/topics.module';
import { MessagesModule } from './messages/messages.module';
import { ExamsModule } from './exams/exams.module';
import { StatisticsModule } from './statistics/statistics.module';
import { FilesModule } from './files/files.module';
import { PagesModule } from './pages/pages.module';
import { PartnersModule } from './partners/partners.module';
import { NewsModule } from './news/news.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    TicketsModule,
    QuestionsModule,
    TopicsModule,
    MessagesModule,
    ExamsModule,
    StatisticsModule,
    FilesModule,
    PagesModule,
    PartnersModule,
    NewsModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
