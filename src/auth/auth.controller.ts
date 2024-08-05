import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  HttpCode,
  Param,
  ParseIntPipe,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole, UserStatus } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password, firebaseToken }: LoginDto) {
    const user = await this.authService.validateUser(login, password);
    if (user === null) {
      throw new UnauthorizedException();
    }

    if (firebaseToken) {
      const tokens = new Set(
        user.firebaseToken as Prisma.JsonArray,
      ) as Set<string>;

      tokens.add(firebaseToken);
      await this.usersService.update(user.id, { firebaseToken: [...tokens] });
    }

    return this.authService.login(user);
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { login, name, password, phone, birthdate } = dto;
    const regData = {
      login,
      name,
      password,
      phone,
      birthdate: birthdate === undefined ? null : new Date(birthdate),
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    } as CreateUserDto;

    const user = await this.usersService.create(regData);

    if (file) {
      const driverLicense = await this.filesService.create(file, user.id);
      await this.usersService.update(user.id, {
        driverLicenseId: driverLicense.id,
      });
    }

    return this.usersService.findById(user.id);
  }

  @Get('check/:id')
  async check(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return { status: user.status };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout() {
    return true;
  }
}
