import { JwtAuthGuard, UserDto } from '@app/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock JwtAuthGuard
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create method of ReservationsService with correct arguments', async () => {
      const createReservationDto: CreateReservationDto = {
        startDate: new Date(),
        endDate: new Date(),
        charge: {
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2024,
            cvc: '123',
          },
          amount: 1000,
        },
      };

      const user: UserDto = {
        _id: 'user-id',
        email: 'user@example.com',
        password: 'password',
      };

      mockReservationsService.create.mockResolvedValue(createReservationDto);

      const result = await controller.create(createReservationDto, user);

      expect(service.create).toHaveBeenCalledWith(createReservationDto, user);
      expect(result).toEqual(createReservationDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      const result = [{ id: 1, placeId: 'some-place-id' }];
      mockReservationsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const result = { id: 1, placeId: 'some-place-id' };
      mockReservationsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a reservation and return the updated reservation', async () => {
      const updateReservationDto: UpdateReservationDto = {
        startDate: new Date(),
        endDate: new Date(),
      };
      const result = { id: 1, ...updateReservationDto };
      mockReservationsService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateReservationDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a reservation by id', async () => {
      const result = { deleted: true };
      mockReservationsService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
