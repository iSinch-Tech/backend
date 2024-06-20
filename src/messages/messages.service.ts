import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';

import * as firebase from 'firebase-admin';
import * as serviceAccount from '../cpv-ptz-firebase-adminsdk-ruhxg-55f915fe9b.json';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Prisma } from '@prisma/client';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { PaginationDto } from 'src/dto/pagination.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { prepareFilter } from 'src/helpers/prepareFilter';

const firebase_params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
    });
  }

  async create(createMessageDto: CreateMessageDto) {
    const recipient = await this.usersService.findById(
      createMessageDto.recipientId,
    );

    const firebaseTokens = recipient?.firebaseToken
      ? (recipient.firebaseToken as Prisma.JsonArray)
      : [];
    if (!firebaseTokens.length) {
      return null;
    }

    const message = await this.prisma.message.create({
      data: createMessageDto,
    });

    const messages = firebaseTokens.map((token) => ({
      notification: {
        title: 'Сообщение',
        body: message.text,
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            badge: 1,
            sound: 'default',
          },
        },
      },
      token: token as string,
    }));
    firebase.messaging().sendAll(messages.map((m) => m as Message));

    return message;
  }

  async findAll(pagination: PaginationDto, filter: FilterMessageDto = {}) {
    const where = prepareFilter(filter) as Prisma.MessageWhereInput;
    const [count, rows] = await this.prisma.$transaction([
      this.prisma.message.count({
        where,
      }),
      this.prisma.message.findMany({
        where,
        include: {
          recipient: true,
          sender: true,
        },
        skip: +pagination.offset,
        take: +pagination.limit,
        orderBy: {
          [pagination.orderBy]: pagination.orderType,
        },
      }),
    ]);
    return {
      rows,
      count,
    };
  }

  remove(id: number) {
    return this.prisma.message.delete({
      where: { id },
    });
  }
}
