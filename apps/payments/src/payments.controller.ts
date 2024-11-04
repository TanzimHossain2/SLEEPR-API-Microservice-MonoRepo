import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PAYMENTS_PATTERN } from '@app/common';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(PAYMENTS_PATTERN.CREATE)
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentCreateChargeDto) {
    try {
      return this.paymentsService.createCharge(data);
    } catch (error) {
      throw error;
    }
  }
}
