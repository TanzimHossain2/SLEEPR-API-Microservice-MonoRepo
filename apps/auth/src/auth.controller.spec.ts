import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDocument } from './users/models/user.schema';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Test case for login method
  describe('login', () => {
    it('should call AuthService.login with correct parameters and send user in response', async () => {
      const mockUser: UserDocument = {
        email: 'test@example.com',
        password: 'password',
      } as UserDocument;

      const mockToken = 'mocked.jwt.token'; // Mock the JWT token
      const mockResponse: Partial<Response> = {
        send: jest.fn(),
      };

      // Mock the return value of the AuthService.login method
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      await authController.login(mockUser, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith(mockUser, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'User authenticated',
        data: { user: mockUser, token: mockToken },
      });
    });
  });

  // Test case for authenticate method
  describe('authenticate', () => {
    it('should return user data when valid payload is provided', async () => {
      const mockData = { user: { email: 'user@example.com' } };

      const result = await authController.authenticate(mockData);

      expect(result).toBe(mockData.user);
    });

    it('should return error details when no user data is provided', async () => {
      const mockData = null;

      const result = await authController.authenticate(mockData);

      expect(result).toEqual({
        status: 'error',
        message: 'Authentication process failed',
        details: 'No user data found in payload',
      });
    });
  });
});
