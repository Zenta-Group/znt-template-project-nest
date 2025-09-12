import { Test, TestingModule } from '@nestjs/testing';
import { CsrfService } from './csrf.service';

describe('CsrfService', () => {
  let service: CsrfService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      upsert: jest.fn(),
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsrfService,
        { provide: 'CSRF_TOKEN_REPOSITORY', useValue: mockRepo },
      ],
    }).compile();
    service = module.get<CsrfService>(CsrfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a csrf token', async () => {
    mockRepo.upsert.mockResolvedValue(undefined);
    const token = await service.generateCsrfToken('user1');
    expect(token).toBeDefined();
  });

  it('should validate csrf token', async () => {
    mockRepo.findById.mockResolvedValue({ token: 'abc' });
    const result = await service.validateCsrfToken('user1', 'abc');
    expect(result).toBe(true);
  });
});
