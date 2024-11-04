import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  async notifyEmail({ email }: NotifyEmailDto) {
    console.log(`Sending email to ${email}`);
  }
}
