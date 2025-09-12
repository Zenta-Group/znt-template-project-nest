import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { GoogleAuthService } from './google-auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let googleAuthService: GoogleAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: GoogleAuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    googleAuthService = module.get<GoogleAuthService>(GoogleAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login with Google', async () => {
    const dto = { idToken: 'token' };
    const result = { access_token: 'jwt', user: { email: 'test@test.com' } };
    jest.spyOn(googleAuthService, 'signIn').mockResolvedValue(result as any);
    expect(await controller.loginWithGoogle(dto)).toBe(result);
    expect(googleAuthService.signIn).toHaveBeenCalledWith(dto.idToken);
  });

  it('should throw if GoogleAuthService.signIn fails', async () => {
    const dto = { idToken: 'token' };
    jest
      .spyOn(googleAuthService, 'signIn')
      .mockRejectedValue(new Error('Invalid token'));
    await expect(controller.loginWithGoogle(dto)).rejects.toThrow(
      'Invalid token',
    );
  });
});
