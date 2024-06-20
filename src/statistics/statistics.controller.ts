import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserStatistics } from './dto/user-statistics.dto';
import { UserData } from 'src/decorators/userData.decorator';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

@ApiBearerAuth()
@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({
    type: UserStatistics,
  })
  @Get('user/:userId')
  userStatistics(
    @Param('userId', ParseIntPipe) userId: number,
    @UserData() user: AuthUserDto,
  ) {
    if (user.role !== UserRole.ADMIN && userId !== +user.id) {
      throw new ForbiddenException();
    }
    return this.statisticsService.userStatistics(userId);
  }
}
