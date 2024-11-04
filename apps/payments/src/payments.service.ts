import { CreateChargeDto } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-10-28.acacia',
    },
  );

  async createCharge({ card, amount }: CreateChargeDto) {
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

      return paymentIntent;
    } catch (error) {
      console.error('Error creating charge ❌', error);
      throw new InternalServerErrorException('Failed to create charge');
    }
  }
}
