import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessageEntity } from './entities/message.entity';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserData } from 'src/decorators/userData.decorator';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

@Controller('messages')
@ApiBearerAuth()
@ApiTags('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({ type: MessageEntity })
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    createMessageDto: CreateMessageDto,
    @UserData() user: AuthUserDto,
  ) {
    return this.messagesService.create({
      ...createMessageDto,
      senderId: +user.id,
    });
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @ApiOkResponse({
    type: PagintaionResponseDto<MessageEntity>,
  })
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterMessageDto,
  ) {
    return this.messagesService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.remove(id);
  }
}
