import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TopicEntity } from './entities/topic.entity';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterTopicDto } from './dto/filter-topic.dto';

@Controller('topics')
@ApiBearerAuth()
@ApiTags('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Post()
  @ApiOkResponse({
    type: TopicEntity,
  })
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Get()
  @ApiOkResponse({
    type: PagintaionResponseDto<TopicEntity>,
  })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterTopicDto,
  ) {
    return this.topicsService.findAll(filter, pagination);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Get(':id')
  @ApiOkResponse({
    type: TopicEntity,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.findOne(id);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Patch(':id')
  @ApiOkResponse({
    type: TopicEntity,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.update(id, updateTopicDto);
  }
  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Delete(':id')
  @ApiOkResponse({
    type: TopicEntity,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.remove(id);
  }
}
