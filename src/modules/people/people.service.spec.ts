import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';

describe('PeopleService', () => {
  let service: PeopleService;
  let mockRepo: any;
  let mockCloudRun: any;

  beforeEach(async () => {
    mockRepo = {
      createWithId: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockCloudRun = { get: jest.fn().mockResolvedValue({}) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        { provide: 'PERSON_REPO', useValue: mockRepo },
        { provide: 'CLOUD_RUN_API_SERVICE', useValue: mockCloudRun },
      ],
    }).compile();
    service = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    mockRepo.createWithId.mockResolvedValue({ id: '1' });
    const result = await service.createUser('name', 'email', 'USER');
    expect(result).toHaveProperty('id');
  });

  it('should throw if user not found', async () => {
    mockRepo.findById.mockResolvedValue(undefined);
    await expect(service.getUserById('notfound')).rejects.toThrow();
  });

  it('should update a user', async () => {
    mockRepo.update.mockResolvedValue({ id: '1', name: 'new' });
    const result = await service.updateUser('1', { name: 'new' } as any);
    expect(result).toHaveProperty('name', 'new');
  });
});
