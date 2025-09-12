import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationsService } from './confirmations.service';
import { BadRequestException } from '@nestjs/common';

describe('ConfirmationsService', () => {
  let service: ConfirmationsService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = { findMany: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmationsService,
        { provide: 'CONFIRMATION_REPO', useValue: mockRepo },
      ],
    }).compile();
    service = module.get<ConfirmationsService>(ConfirmationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findMany on search', async () => {
    mockRepo.findMany.mockResolvedValue([]);
    const params = { query: '123', mode: 'rut' };
    await service.search(params as any);
    expect(mockRepo.findMany).toHaveBeenCalled();
  });

  it('should throw BadRequestException if endDate < startDate', async () => {
    const params = {
      query: '123',
      mode: 'rut',
      startDate: '2023-01-02',
      endDate: '2023-01-01',
    };
    await expect(service.search(params as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should use default orderBy if not provided', async () => {
    mockRepo.findMany.mockResolvedValue([]);
    const params = { query: '123', mode: 'rut' };
    await service.search(params as any);
    expect(mockRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ order: expect.any(Object) }),
    );
  });
});
