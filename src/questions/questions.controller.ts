import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FilterQuestionDto } from './dto/filter-question.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { QuestionEntity } from './entities/question.entity';

@Controller('questions')
@ApiBearerAuth()
@ApiTags('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Post()
  @ApiOkResponse({
    type: QuestionEntity,
  })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Get()
  @ApiOkResponse({
    type: PagintaionResponseDto<QuestionEntity>,
  })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterQuestionDto,
  ) {
    return this.questionsService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Get(':id')
  @ApiOkResponse({
    type: QuestionEntity,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Patch(':id')
  @ApiOkResponse({
    type: QuestionEntity,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Delete(':id')
  @ApiOkResponse({
    type: QuestionEntity,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }
}
