import { NOTIFICATION_SERVICE, NOTIFICATIONS_PATTERN } from '@app/common';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-10-28.acacia',
    },
  );

  async createCharge({ card, amount, email }: PaymentCreateChargeDto) {
    try {
      console.log('Creating charge 🔥', card, amount);

      // // Step 1: Create a payment method without the token property
      // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card: {
      //     number: card.number,
      //     exp_month: card.exp_month,
      //     exp_year: card.exp_year,
      //     cvc: card.cvc,
      //   },
      // });

      // Step 2: Create a payment intent using the created payment method
      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100,
        currency: 'usd',
        confirm: true,
        payment_method_types: ['card'],
      });

      // Step 3: Send a notification to the notification service
      this.notificationClient.emit(NOTIFICATIONS_PATTERN.NOTIFY_EMAIL, {
        email,
        text: `You have successfully paid $${amount} 🎉`,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating charge ❌', error);
      throw new InternalServerErrorException('Failed to create charge');
    }
  }
}
