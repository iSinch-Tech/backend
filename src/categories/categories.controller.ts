import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
@ApiBearerAuth()
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: CategoryEntity })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({ type: PagintaionResponseDto<CategoryEntity> })
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterCategoryDto,
  ) {
    return this.categoriesService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Get(':id')
  @ApiOkResponse({ type: CategoryEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Patch(':id')
  @ApiOkResponse({ type: CategoryEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Delete(':id')
  @ApiOkResponse({ type: CategoryEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
