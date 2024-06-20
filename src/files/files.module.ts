import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('UPLOAD_DEST'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService, MulterModule],
})
export class FilesModule {}
