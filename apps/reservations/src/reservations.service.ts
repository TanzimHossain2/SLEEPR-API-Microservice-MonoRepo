import { AUTH_SERVICE, PAYMENTS_PATTERN, PAYMENTS_SERVICE } from '@app/common';
import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repositary';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.paymentService
      .send(PAYMENTS_PATTERN.CREATE, createReservationDto.charge)
      .pipe(
        map(async (res) => {
          if (!res) {
            throw new NotAcceptableException('Payment failed');
          }

          return this.reservationsRepository.create({
            ...createReservationDto,
            timestamp: new Date(),
            userId: userId,
            invoiceId: res.id,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      {
        $set: updateReservationDto,
      },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }

  async validateAuth() {
    return this.authClient.send(
      { cmd: 'validate' },
      {
        /* data */
      },
    );
  }
}
