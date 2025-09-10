import { MessagesService } from './messages.service';
import { SearchMessagesDto } from './dtos/search-messages.dto';
import { AuditLogsService } from 'src/shared/services/audit-logs.service';

describe('MessagesService', () => {
  let service: MessagesService;
  let repo: any;
  let mockAuditLogsService: any;
  const mockUser = { id: '1', email: 'test@demo.com', role: 'lector' };

  beforeEach(() => {
    repo = { findAll: jest.fn() };
    mockAuditLogsService = { logEvent: jest.fn().mockResolvedValue({}) };
    service = new MessagesService(repo, mockAuditLogsService);
  });

  it('debería buscar mensajes por confirmation_id y paginar', async () => {
    repo.findAll.mockResolvedValue('result');
    const params: SearchMessagesDto = {
      offset: 0,
      limit: 10,
      confirmation_id: 'c1',
    } as any;
    const result = await service.getMessages(mockUser, params);
    expect(repo.findAll).toHaveBeenCalledWith({
      where: { confirmation_id: 'c1' },
      order: { timestamp: 'DESC' },
      limit: 10,
      offset: 0,
    });
    expect(result).toBe('result');
  });

  it('debería pasar correctamente los parámetros de paginación', async () => {
    repo.findAll.mockResolvedValue('result');
    const params: SearchMessagesDto = {
      offset: 5,
      limit: 20,
      confirmation_id: 'c2',
    } as any;
    await service.getMessages(mockUser, params);
    expect(repo.findAll).toHaveBeenCalledWith({
      where: { confirmation_id: 'c2' },
      order: { timestamp: 'DESC' },
      limit: 20,
      offset: 5,
    });
  });
});
