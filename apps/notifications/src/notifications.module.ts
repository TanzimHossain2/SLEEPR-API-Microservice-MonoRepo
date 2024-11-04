import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { LoggerModule } from '@app/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3004),
        SMTP_USER: Joi.string().required(),
        GOOGLE_0AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_0AUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_0AUTH_REFRESH_TOKEN: Joi.string().required(),
      }),
    }),
    LoggerModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
