import {
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserData } from 'src/decorators/userData.decorator';
import { FilesService } from './files.service';
import { createReadStream, statSync } from 'fs';
import type { Response } from 'express';
import { FileEntity } from './entities/file.entity';
import { FilterFileDto } from './dto/filter-file.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PagintaionResponseDto } from 'src/dto/pagination-responce.dto';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from '@prisma/client';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: FileEntity })
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 })],
      }),
    )
    file: Express.Multer.File,
    @UserData() user: AuthUserDto,
  ) {
    return this.filesService.create(file, +user.id);
  }

  @UseGuards(RoleGuard([UserRole.ADMIN, UserRole.USER]))
  @Get(':id/download')
  @Header('Accept-Ranges', 'bytes')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: { range: string },
    @Res({ passthrough: true }) res: Response,
    // @UserData() user: AuthUserDto,
  ) {
    const file = await this.filesService.findOne(id);

    if (!file) {
      throw new NotFoundException();
    }

    // if (user.role !== UserRole.ADMIN && file.userId !== user.id) {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // }

    const { size } = statSync(file.path);

    const resHeaders: HeadersInit = {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    };

    if (headers.range) {
      const parts = headers.range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;

      resHeaders['Content-Range'] = `bytes ${start}-${end}/${size}`;
      resHeaders['Content-Length'] = chunksize.toString();

      const readStreamfile = createReadStream(file.path, {
        start,
        end,
        highWaterMark: 60,
      });

      res.writeHead(HttpStatus.PARTIAL_CONTENT, resHeaders);
      return new StreamableFile(readStreamfile);
    } else {
      resHeaders['Content-Length'] = size.toString();

      res.writeHead(HttpStatus.OK, resHeaders);
      return new StreamableFile(createReadStream(file.path));
    }
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Get()
  @ApiOkResponse({ type: PagintaionResponseDto<FileEntity> })
  findAll(
    @Query('filter', new ValidationPipe({ whitelist: true }))
    filter: FilterFileDto,
    @Query(new ValidationPipe({ transform: true }))
    pagination: PaginationDto,
  ) {
    return this.filesService.findAll(pagination, filter);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Delete(':id')
  @ApiOkResponse({ type: FileEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
