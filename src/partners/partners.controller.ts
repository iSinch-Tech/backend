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
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterPartnerDto } from './dto/filter-partner.dto';
import { PartnerEntity } from './entities/partner.entity';

@Controller('partners')
@ApiBearerAuth()
@ApiTags('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: PartnerEntity })
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({ type: PagintaionResponseDto<PartnerEntity> })
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterPartnerDto,
  ) {
    return this.partnersService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @ApiOkResponse({ type: PartnerEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.findOne(id);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOkResponse({ type: PartnerEntity })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: PartnerEntity })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.remove(id);
  }
}
