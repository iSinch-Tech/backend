import { Module } from '@nestjs/common';
import { DrivingService } from './driving.service';
import { DrivingController } from './driving.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DrivingController],
  providers: [DrivingService],
})
export class ScheduleModule {}
