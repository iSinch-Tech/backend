import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  ValidationPipe,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from '@prisma/client';
import { ExamEntity } from './entities/exam.entity';
import { UserData } from 'src/decorators/userData.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterExamDto } from './dto/filter-exam.dto';
import { AnswersExamDto } from './dto/answer-exam.dto';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

@ApiBearerAuth()
@ApiTags('exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({
    type: ExamEntity,
  })
  @Post()
  create(
    @UserData() user: AuthUserDto,
    @Body(new ValidationPipe({ transform: true })) createExamDto: CreateExamDto,
  ) {
    return this.examsService.create(
      {
        ...createExamDto,
        userId: user.id,
      },
      user,
    );
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({
    type: ExamEntity,
    isArray: true,
  })
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterExamDto,
    @UserData() user: AuthUserDto,
  ) {
    if (
      user.role !== UserRole.ADMIN &&
      filter?.userId &&
      +filter.userId !== user.id
    ) {
      throw new ForbiddenException();
    }
    return this.examsService.findAll(filter, pagination);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({
    type: ExamEntity,
    isArray: true,
  })
  @Get('my')
  findMy(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterExamDto,
    @UserData() user: AuthUserDto,
  ) {
    filter.userId = +user.id;
    return this.examsService.findAll(filter, pagination);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({
    type: ExamEntity,
  })
  @Get(':id')
  async findOne(@UserData() user, @Param('id', ParseIntPipe) id: number) {
    const exam = await this.examsService.findOne(id);
    if (!exam) {
      throw new NotFoundException();
    }
    if (user.role !== UserRole.ADMIN && exam.userId !== user.id) {
      throw new ForbiddenException();
    }
    return exam;
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({
    type: ExamEntity,
  })
  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() answerExamDto: AnswersExamDto,
    @UserData() user: AuthUserDto,
  ) {
    return this.examsService.saveAnswer(user.id, id, answerExamDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({
    type: ExamEntity,
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.remove(id);
  }
}
