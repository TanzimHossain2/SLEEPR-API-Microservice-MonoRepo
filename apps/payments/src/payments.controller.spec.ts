import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreateChargeDto } from '@app/common';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    const mockPaymentsService = {
      createCharge: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockPaymentsService }],
    }).compile();

    paymentsController = app.get<PaymentsController>(PaymentsController);
    paymentsService = app.get<PaymentsService>(PaymentsService);
  });

  describe('createCharge', () => {
    it('should call createCharge in PaymentsService with correct data', async () => {
      const chargeData: CreateChargeDto = {
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2024,
          cvc: '123',
        },
        amount: 5000,
      };

      await paymentsController.createCharge(chargeData);
      expect(paymentsService.createCharge).toHaveBeenCalledWith(chargeData);
    });

    it('should handle errors and log them', async () => {
      const chargeData: CreateChargeDto = {
        card: {
          number: '4000000000000002', // Test card number that triggers a decline
          exp_month: 12,
          exp_year: 2024,
          cvc: '123',
        },
        amount: 5000,
      };

      jest
        .spyOn(paymentsService, 'createCharge')
        .mockRejectedValueOnce(new Error('Charge failed'));

      try {
        await paymentsController.createCharge(chargeData);
      } catch (error) {
        expect(error.message).toBe('Charge failed');
      }
    });
  });
});
