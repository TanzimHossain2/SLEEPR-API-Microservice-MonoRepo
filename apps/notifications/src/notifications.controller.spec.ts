import { Test, TestingModule } from '@nestjs/testing';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let notificationsController: NotificationsController;
  let notificationsService: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            notifyEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationsController = module.get<NotificationsController>(
      NotificationsController,
    );
    notificationsService =
      module.get<NotificationsService>(NotificationsService);
  });

  describe('notifyEmail', () => {
    it('should call NotificationsService.notifyEmail with correct data', async () => {
      const dto: NotifyEmailDto = { email: 'test@example.com', text: 'Hello!' };
      await notificationsController.notifyEmail(dto);

      expect(notificationsService.notifyEmail).toHaveBeenCalledWith(dto);
    });
  });
});
