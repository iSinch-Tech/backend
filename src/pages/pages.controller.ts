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
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterPageDto } from './dto/filter-page.dto';
import { PageEntity } from './entities/page.entity';

@Controller('pages')
@ApiBearerAuth()
@ApiTags('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: PageEntity })
  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({ type: PagintaionResponseDto<PageEntity> })
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterPageDto,
  ) {
    return this.pagesService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({ type: PageEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagesService.findOne(id);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOkResponse({ type: PageEntity })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(id, updatePageDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: PageEntity })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagesService.remove(id);
  }
}
