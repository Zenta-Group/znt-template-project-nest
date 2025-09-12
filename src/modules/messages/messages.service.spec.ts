import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = { findMany: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: 'MESSAGE_REPO', useValue: mockRepo },
      ],
    }).compile();
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if confirmation_id is missing', async () => {
    await expect(service.getMessages({} as any)).rejects.toThrow();
  });

  it('should call findMany with correct filter', async () => {
    mockRepo.findMany.mockResolvedValue([]);
    await service.getMessages({
      confirmation_id: 'abc',
      limit: 1,
      offset: 0,
    } as any);
    expect(mockRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ filter: expect.any(Object) }),
    );
  });
});
