import { Test, TestingModule } from '@nestjs/testing';
import { GenericsService } from './generics.service';

describe('GenericsService', () => {
  let service: GenericsService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      createWithId: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenericsService,
        { provide: 'GENERIC_REPOSITORY', useValue: mockRepo },
      ],
    }).compile();
    service = module.get<GenericsService>(GenericsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a generic', async () => {
    mockRepo.createWithId.mockResolvedValue({ id: '1' });
    const result = await service.create({ name: 'n', description: 'd' } as any);
    expect(result).toHaveProperty('id');
  });

  it('should throw if not found', async () => {
    mockRepo.findById.mockResolvedValue(undefined);
    await expect(service.getById('notfound')).rejects.toThrow();
  });

  it('should update a generic', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1' });
    mockRepo.update.mockResolvedValue({ id: '1', name: 'new' });
    const result = await service.update('1', {
      name: 'new',
      description: 'd',
      status: 'Activo',
    } as any);
    expect(result).toHaveProperty('name', 'new');
  });
});
