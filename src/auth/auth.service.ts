import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Payload } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(user: Payload) {
    const { firebaseToken, ...payload } = user;
    return {
      ...payload,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findByLogin(login);
    if (
      user === null ||
      user.status !== UserStatus.ACTIVE ||
      !bcrypt.compareSync(password, user.passwordHash)
    ) {
      return null;
    }

    const { passwordHash, ...userData } = user;

    return userData as Payload;
  }
}
