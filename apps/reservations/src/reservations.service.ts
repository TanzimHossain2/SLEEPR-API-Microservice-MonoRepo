import { AUTH_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repositary';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  create(createReservationDto: CreateReservationDto, userId: string) {
   

    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: userId,
    });
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      {
        $set: updateReservationDto,
      },
    );
  }

  remove(_id: string) {
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
