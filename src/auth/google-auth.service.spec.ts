import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthService } from './google-auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CsrfService } from 'src/shared/services/csrf.service';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;
  let mockJwt: any;
  let mockConfig: any;
  let mockRepo: any;
  let mockCsrf: any;

  beforeEach(async () => {
    mockJwt = { sign: jest.fn().mockReturnValue('token') };
    mockConfig = {
      get: jest.fn().mockImplementation((k) => {
        if (k === 'secretKeyAuth') return 'secret';
        if (k === 'tokenExpiration') return '1h';
        if (k === 'googleClientId') return 'clientid';
        return undefined;
      }),
    };
    mockRepo = { findOne: jest.fn() };
    mockCsrf = { generateCsrfToken: jest.fn().mockResolvedValue('csrf') };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuthService,
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
        { provide: 'USER_REPOSITORY', useValue: mockRepo },
        { provide: CsrfService, useValue: mockCsrf },
      ],
    }).compile();
    service = module.get<GoogleAuthService>(GoogleAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return code 1 if user not found', async () => {
    mockRepo.findOne.mockResolvedValue(undefined);
    const result = await service.signIn('token');
    expect(result.code).toBe(1);
  });
});
