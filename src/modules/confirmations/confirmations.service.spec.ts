import { ConfirmationsService } from './confirmations.service';
import { SearchConfirmationsDto } from './dtos/search-confirmations.dto';
import { AuditLogsService } from 'src/shared/services/audit-logs.service';
import { BadRequestException } from '@nestjs/common';
import { DateUtil } from 'src/shared/utils/date.util';

// Mock DateUtil
jest.mock('src/shared/utils/date.util', () => ({
  DateUtil: {
    buildDateRangeISO: jest.fn(),
  },
}));

describe('ConfirmationsService', () => {
  let service: ConfirmationsService;
  let repo: any;
  let mockAuditLogsService: any;
  const mockUser = { id: '1', email: 'test@demo.com', role: 'lector' };

  beforeEach(() => {
    repo = { findAll: jest.fn() };
    mockAuditLogsService = { logEvent: jest.fn().mockResolvedValue({}) };
    service = new ConfirmationsService(repo, mockAuditLogsService);
  });

  it('debería buscar por rut y ordenar por defecto', async () => {
    repo.findAll.mockResolvedValue('result');
    const params: SearchConfirmationsDto = {
      mode: 'rut',
      query: '12345678-9',
      offset: 0,
      limit: 10,
    } as any;
    const result = await service.search(mockUser, params);
    expect(repo.findAll).toHaveBeenCalledWith({
      where: { rut: '12345678-9' },
      order: { createdDatetime: 'DESC' },
      limit: 10,
      offset: 0,
    });
    expect(result).toBe('result');
  });

  it('debería buscar por phone_number y ordenar por campo y dirección', async () => {
    repo.findAll.mockResolvedValue('result');
    const params: SearchConfirmationsDto = {
      mode: 'phone',
      query: '987654321',
      offset: 5,
      limit: 20,
      orderBy: 'patientName',
      order: 'ASC',
    } as any;
    const result = await service.search(mockUser, params);
    expect(repo.findAll).toHaveBeenCalledWith({
      where: { phone_number: '987654321' },
      order: { patientName: 'ASC' },
      limit: 20,
      offset: 5,
    });
    expect(result).toBe('result');
  });

  it('debería usar dirección DESC si se indica', async () => {
    repo.findAll.mockResolvedValue('result');
    const params: SearchConfirmationsDto = {
      mode: 'rut',
      query: '12345678-9',
      offset: 0,
      limit: 10,
      orderBy: 'createdDatetime',
      order: 'DESC',
    } as any;
    await service.search(mockUser, params);
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ order: { createdDatetime: 'DESC' } }),
    );
  });

  it('debería usar dirección ASC si se indica', async () => {
    repo.findAll.mockResolvedValue('result');
    const params: SearchConfirmationsDto = {
      mode: 'rut',
      query: '12345678-9',
      offset: 0,
      limit: 10,
      orderBy: 'createdDatetime',
      order: 'ASC',
    } as any;
    await service.search(mockUser, params);
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ order: { createdDatetime: 'ASC' } }),
    );
  });

  describe('Filtrado por fechas', () => {
    beforeEach(() => {
      (DateUtil.buildDateRangeISO as jest.Mock).mockReturnValue({
        startISO: '2023-01-01T00:00:00.000Z',
        endISO: '2023-01-02T23:59:59.999Z',
      });
    });

    it('debería aplicar filtro con solo startDate (gte)', async () => {
      repo.findAll.mockResolvedValue('result');
      const params: SearchConfirmationsDto = {
        mode: 'rut',
        query: '12345678-9',
        offset: 0,
        limit: 10,
        startDate: '2023-01-01',
      } as any;

      await service.search(mockUser, params);

      expect(DateUtil.buildDateRangeISO).toHaveBeenCalledWith(
        '2023-01-01',
        undefined,
      );
      expect(repo.findAll).toHaveBeenCalledWith({
        where: {
          rut: '12345678-9',
          createdDatetime: { gte: '2023-01-01T00:00:00.000Z' },
        },
        order: { createdDatetime: 'DESC' },
        limit: 10,
        offset: 0,
      });
    });

    it('debería aplicar filtro con solo endDate (lte)', async () => {
      repo.findAll.mockResolvedValue('result');
      const params: SearchConfirmationsDto = {
        mode: 'rut',
        query: '12345678-9',
        offset: 0,
        limit: 10,
        endDate: '2023-01-02',
      } as any;

      await service.search(mockUser, params);

      expect(DateUtil.buildDateRangeISO).toHaveBeenCalledWith(
        undefined,
        '2023-01-02',
      );
      expect(repo.findAll).toHaveBeenCalledWith({
        where: {
          rut: '12345678-9',
          createdDatetime: { lte: '2023-01-02T23:59:59.999Z' },
        },
        order: { createdDatetime: 'DESC' },
        limit: 10,
        offset: 0,
      });
    });

    it('debería aplicar filtro con rango de fechas (between)', async () => {
      repo.findAll.mockResolvedValue('result');
      const params: SearchConfirmationsDto = {
        mode: 'rut',
        query: '12345678-9',
        offset: 0,
        limit: 10,
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      } as any;

      await service.search(mockUser, params);

      expect(DateUtil.buildDateRangeISO).toHaveBeenCalledWith(
        '2023-01-01',
        '2023-01-02',
      );
      expect(repo.findAll).toHaveBeenCalledWith({
        where: {
          rut: '12345678-9',
          createdDatetime: [
            '2023-01-01T00:00:00.000Z',
            '2023-01-02T23:59:59.999Z',
          ],
        },
        order: { createdDatetime: 'DESC' },
        limit: 10,
        offset: 0,
      });
    });

    it('debería aplicar filtro en campo de fecha personalizado', async () => {
      repo.findAll.mockResolvedValue('result');
      const params: SearchConfirmationsDto = {
        mode: 'rut',
        query: '12345678-9',
        offset: 0,
        limit: 10,
        startDate: '2023-01-01',
        dateField: 'appointmentDatetime',
      } as any;

      await service.search(mockUser, params);

      expect(repo.findAll).toHaveBeenCalledWith({
        where: {
          rut: '12345678-9',
          appointmentDatetime: { gte: '2023-01-01T00:00:00.000Z' },
        },
        order: { createdDatetime: 'DESC' },
        limit: 10,
        offset: 0,
      });
    });

    it('debería lanzar BadRequestException si endDate es menor que startDate', async () => {
      const params: SearchConfirmationsDto = {
        mode: 'rut',
        query: '12345678-9',
        offset: 0,
        limit: 10,
        startDate: '2023-01-02',
        endDate: '2023-01-01',
      } as any;

      await expect(service.search(mockUser, params)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.search(mockUser, params)).rejects.toThrow(
        'La fecha de fin (endDate) debe ser igual o mayor que la fecha de inicio (startDate). El rango mínimo de búsqueda es 1 día.',
      );
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar errores y registrar en audit logs', async () => {
      const error = new Error('Database error');
      repo.findAll.mockRejectedValue(error);

      const params: SearchConfirmationsDto = {
        mode: 'rut',
        query: '12345678-9',
        offset: 0,
        limit: 10,
      } as any;

      await expect(service.search(mockUser, params)).rejects.toThrow(
        'Database error',
      );

      expect(mockAuditLogsService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userEmail: 'test@demo.com',
          action: 'SEARCH_CONFIRMATIONS',
          endpoint: '/confirmaciones',
          params: expect.objectContaining({
            mode: 'rut',
            query: '12345678-9',
            offset: 0,
            limit: 10,
          }),
          status: 'error',
          statusDescription: 'Database error',
          resultCount: 0,
        }),
      );
    });
  });
});
