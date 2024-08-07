import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DrivingService } from './driving.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { RecordStatus, UserRole } from '@prisma/client';
import { CreateCellDto } from './dto/create-cell.dto';
import { CellEntity } from './entities/cell.entity';
import { FilterCellDto } from './dto/filter-cell.dto';
import { UserData } from 'src/decorators/userData.decorator';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UpdateCellDto } from './dto/update-cell.dto';

@Controller('driving')
@ApiBearerAuth()
@ApiTags('driving')
export class DrivingController {
  constructor(private readonly drivingService: DrivingService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Post()
  @ApiOkResponse({
    type: CellEntity,
  })
  create(
    @Body(new ValidationPipe({ transform: true })) createCellDto: CreateCellDto,
  ) {
    return this.drivingService.create(createCellDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.TRAINER]))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Patch(':id')
  @ApiOkResponse({
    type: CellEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCellDto: UpdateCellDto,
    @UserData() user: AuthUserDto,
  ) {
    const cell = await this.drivingService.findOne(id);
    if (!cell) {
      throw new NotFoundException();
    }
    if (user.role !== UserRole.ADMIN && cell.trainerId !== +user.id) {
      throw new ForbiddenException();
    }
    return this.drivingService.update(id, updateCellDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: CellEntity })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.drivingService.remove(id);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.TRAINER]))
  @Get()
  @ApiOkResponse({
    type: CellEntity,
    isArray: true,
  })
  findAll(
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterCellDto,
  ) {
    return this.drivingService.findAll(filter);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.TRAINER]))
  @Get('/month/:month')
  @ApiOkResponse({
    type: CellEntity,
    isArray: true,
  })
  findByMonth(@Param('month') month: string) {
    return this.drivingService.findByMonth(month);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.STUDENT, UserRole.TRAINER]))
  @Post('/take/:id')
  @ApiOkResponse({
    type: CellEntity,
  })
  take(@Param('id', ParseIntPipe) id: number, @UserData() user: AuthUserDto) {
    if (!user.trainerId) {
      throw new BadRequestException('You do not have a trainer');
    }
    return this.drivingService.takeCell(id, user);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.STUDENT, UserRole.TRAINER]))
  @Post('/leave/:id')
  @ApiOkResponse({
    type: CellEntity,
  })
  async leave(
    @Param('id', ParseIntPipe) id: number,
    @UserData() user: AuthUserDto,
  ) {
    const cell = await this.drivingService.findAll({
      id,
      status: RecordStatus.OPEN,
      userId: +user.id,
    });

    if (cell.length === 0 || cell[0].userId !== +user.id) {
      throw new ForbiddenException();
    }

    return this.drivingService.update(id, { userId: null });
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.STUDENT, UserRole.TRAINER]))
  @Get('/available/:month')
  @ApiOkResponse({
    type: CellEntity,
    isArray: true,
  })
  findAvailable(@Param('month') month: string, @UserData() user: AuthUserDto) {
    if (!user.trainerId) {
      return [];
    }
    return this.drivingService.findByMonth(month, {
      status: RecordStatus.OPEN,
      userId: null,
      trainerId: user.trainerId,
    });
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.STUDENT, UserRole.TRAINER]))
  @Get('/my')
  @ApiOkResponse({
    type: CellEntity,
    isArray: true,
  })
  findMy(@UserData() user: AuthUserDto) {
    return this.drivingService.findAll({
      status: RecordStatus.OPEN,
      userId: +user.id,
    });
  }

  @UseGuards(RoleGuard([UserRole.ADMIN]))
  @Get('/generate/:month')
  @ApiOkResponse({
    type: CellEntity,
    isArray: true,
  })
  generate(@Param('month') month: string) {
    return this.drivingService.generate(month);
  }
}
