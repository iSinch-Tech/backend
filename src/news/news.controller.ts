import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterNewsDto } from './dto/filter-news.dto';
import { NewsEntity } from './entities/news.entity';

@Controller('news')
@ApiBearerAuth()
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: NewsEntity })
  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({ type: PagintaionResponseDto<NewsEntity> })
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterNewsDto,
  ) {
    return this.newsService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({ type: NewsEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOkResponse({ type: NewsEntity })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.update(id, updateNewsDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: NewsEntity })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }
}
