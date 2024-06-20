import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  ValidationPipe,
  UsePipes,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserData } from 'src/decorators/userData.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

@Controller('users')
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.TRAINER]))
  @Get()
  @ApiOkResponse({
    type: PagintaionResponseDto<UserEntity>,
  })
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterUserDto,
  ) {
    return this.usersService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Get(':id')
  @ApiOkResponse({
    type: UserEntity,
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @UserData() user) {
    if (user.role !== UserRole.ADMIN && id !== user.id) {
      throw new ForbiddenException();
    }
    return this.usersService.findById(id);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UserData() user: AuthUserDto,
  ) {
    if (user.role !== UserRole.ADMIN && id !== user.id) {
      throw new ForbiddenException();
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
