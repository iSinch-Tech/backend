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
  UsePipes,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from '@prisma/client';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { TicketEntity } from './entities/ticket.entity';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';

@Controller('tickets')
@ApiBearerAuth()
@ApiTags('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Post()
  @ApiOkResponse({
    type: TicketEntity,
  })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Get()
  @ApiOkResponse({
    type: PagintaionResponseDto<TicketEntity>,
  })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterTicketDto,
  ) {
    return this.ticketsService.findAll(filter, pagination);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Get(':id')
  @ApiOkResponse({
    type: TicketEntity,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Patch(':id')
  @ApiOkResponse({
    type: TicketEntity,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Delete(':id')
  @ApiOkResponse({
    type: TicketEntity,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }
}
