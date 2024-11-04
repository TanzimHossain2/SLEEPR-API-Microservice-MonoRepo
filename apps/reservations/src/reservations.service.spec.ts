import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsRepository } from './reservations.repositary';
import { ReservationsService } from './reservations.service';
import { AUTH_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let repository: ReservationsRepository;
  let authClient: ClientProxy;

  const mockAuthClient = {
    send: jest.fn(),
  };

  const mockReservationsRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useValue: mockReservationsRepository,
        },
        {
          provide: AUTH_SERVICE,
          useValue: mockAuthClient,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    repository = module.get<ReservationsRepository>(ReservationsRepository);
    authClient = module.get<ClientProxy>(AUTH_SERVICE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation and return the result', async () => {
      const createReservationDto: CreateReservationDto = {
        startDate: new Date(),
        endDate: new Date(),
        placeId: 'some-place-id',
        invoiceId: 'some-invoice-id',
      };
      const userId = 'user-id';

      const expectedResponse = { ...createReservationDto, userId, timestamp: new Date() };
      mockReservationsRepository.create.mockResolvedValue(expectedResponse);

      const result = await service.create(createReservationDto, userId);

      expect(repository.create).toHaveBeenCalledWith({
        ...createReservationDto,
        userId,
        timestamp: expect.any(Date),
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      const expectedReservations = [{ id: 1, placeId: 'some-place-id' }];
      mockReservationsRepository.find.mockResolvedValue(expectedReservations);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(expectedReservations);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const reservationId = '1';
      const expectedReservation = { id: reservationId, placeId: 'some-place-id' };
      mockReservationsRepository.findOne.mockResolvedValue(expectedReservation);

      const result = await service.findOne(reservationId);

      expect(repository.findOne).toHaveBeenCalledWith({ _id: reservationId });
      expect(result).toEqual(expectedReservation);
    });

    it('should return null if reservation not found', async () => {
      const reservationId = 'non-existent-id';
      mockReservationsRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(reservationId);

      expect(repository.findOne).toHaveBeenCalledWith({ _id: reservationId });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a reservation and return the updated reservation', async () => {
      const reservationId = '1';
      const updateReservationDto: UpdateReservationDto = {
        startDate: new Date(),
        endDate: new Date(),
      };
      const expectedResponse = { id: reservationId, ...updateReservationDto };
      mockReservationsRepository.findOneAndUpdate.mockResolvedValue(expectedResponse);

      const result = await service.update(reservationId, updateReservationDto);

      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reservationId },
        { $set: updateReservationDto },
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should return null if reservation to update is not found', async () => {
      const reservationId = 'non-existent-id';
      const updateReservationDto: UpdateReservationDto = {
        startDate: new Date(),
        endDate: new Date(),
      };
      mockReservationsRepository.findOneAndUpdate.mockResolvedValue(null);

      const result = await service.update(reservationId, updateReservationDto);

      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reservationId },
        { $set: updateReservationDto },
      );
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a reservation by id', async () => {
      const reservationId = '1';
      const expectedResponse = { deleted: true };
      mockReservationsRepository.findOneAndDelete.mockResolvedValue(expectedResponse);

      const result = await service.remove(reservationId);

      expect(repository.findOneAndDelete).toHaveBeenCalledWith({ _id: reservationId });
      expect(result).toEqual(expectedResponse);
    });

    it('should return null if reservation to delete is not found', async () => {
      const reservationId = 'non-existent-id';
      mockReservationsRepository.findOneAndDelete.mockResolvedValue(null);

      const result = await service.remove(reservationId);

      expect(repository.findOneAndDelete).toHaveBeenCalledWith({ _id: reservationId });
      expect(result).toBeNull();
    });
  });

  describe('validateAuth', () => {
    it('should call authClient.send with the correct command', async () => {
      const expectedResponse = 'Valid';
      mockAuthClient.send.mockResolvedValue(expectedResponse);

      const result = await service.validateAuth();

      expect(authClient.send).toHaveBeenCalledWith({ cmd: 'validate' }, {});
      expect(result).toBe(expectedResponse);
    });
  });
});
