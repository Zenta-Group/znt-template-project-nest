import { AxiosService } from './axios.service';
import { SecurityType } from '../config/axios.configuration';
import {
  BadRequestException,
  UnauthorizedAccessException,
  ResourceNotFoundException,
  InternalServerErrorException,
  IntegrationException,
  InvalidEndpointException,
} from '../../shared/exceptions/integration-exceptions';

describe('AxiosService - Métodos HTTP y manejo de errores', () => {
  let service: AxiosService<any>;
  let axiosInstance: any;
  let logger: any;

  beforeEach(() => {
    service = new AxiosService('http://localhost', { type: SecurityType.NONE });
    axiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    logger = {
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
    };
    // @ts-ignore
    service['axiosInstance'] = axiosInstance;
    // @ts-ignore
    service['logger'] = logger;
  });

  it('should return data on get', async () => {
    axiosInstance.get.mockResolvedValue({ data: { ok: true } });
    const result = await service.get('/test');
    expect(result).toEqual({ ok: true });
  });

  it('should handle 400 error', async () => {
    axiosInstance.get.mockRejectedValue({
      response: { status: 400, data: { message: 'bad' } },
      message: 'bad',
      stack: 's',
    });
    await expect(service.get('/bad')).rejects.toThrow(BadRequestException);
  });

  it('should handle 401 error', async () => {
    axiosInstance.get.mockRejectedValue({
      response: { status: 401, data: {} },
      message: 'unauth',
      stack: 's',
    });
    await expect(service.get('/unauth')).rejects.toThrow(
      UnauthorizedAccessException,
    );
  });

  it('should handle 404 error', async () => {
    axiosInstance.get.mockRejectedValue({
      response: { status: 404, data: {} },
      message: 'not found',
      stack: 's',
    });
    await expect(service.get('/notfound')).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should handle 500 error', async () => {
    axiosInstance.get.mockRejectedValue({
      response: { status: 500, data: { message: 'err' } },
      message: 'err',
      stack: 's',
    });
    await expect(service.get('/err')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should handle unknown http error', async () => {
    axiosInstance.get.mockRejectedValue({
      response: { status: 418, data: {} },
      message: 'teapot',
      stack: 's',
    });
    await expect(service.get('/teapot')).rejects.toThrow(IntegrationException);
  });

  it('should handle request error', async () => {
    axiosInstance.get.mockRejectedValue({
      request: {},
      message: 'no response',
      stack: 's',
    });
    await expect(service.get('/noresp')).rejects.toThrow(
      InvalidEndpointException,
    );
  });

  it('should return data on post', async () => {
    axiosInstance.post.mockResolvedValue({ data: { ok: true } });
    const result = await service.post('/test', { foo: 'bar' });
    expect(result).toEqual({ ok: true });
  });

  it('should handle error on post', async () => {
    axiosInstance.post.mockRejectedValue({
      response: { status: 400, data: { message: 'bad' } },
      message: 'bad',
      stack: 's',
    });
    await expect(service.post('/fail', {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return data on put', async () => {
    axiosInstance.put.mockResolvedValue({ data: { ok: true } });
    const result = await service.put('/test', { foo: 'bar' });
    expect(result).toEqual({ ok: true });
  });

  it('should handle error on put', async () => {
    axiosInstance.put.mockRejectedValue({
      response: { status: 401, data: {} },
      message: 'unauth',
      stack: 's',
    });
    await expect(service.put('/fail', {})).rejects.toThrow(
      UnauthorizedAccessException,
    );
  });

  it('should call delete without error', async () => {
    axiosInstance.delete.mockResolvedValue({});
    await expect(service.delete('/test')).resolves.toBeUndefined();
  });

  it('should handle error on delete', async () => {
    axiosInstance.delete.mockRejectedValue({
      response: { status: 404, data: {} },
      message: 'not found',
      stack: 's',
    });
    await expect(service.delete('/fail')).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should call onModuleInit and setup interceptor', () => {
    const spy = jest.spyOn(service, 'onModuleInit');
    service.onModuleInit();
    expect(spy).toHaveBeenCalled();
  });

  describe('setupAuthenticationInterceptor', () => {
    it('should set API key header', () => {
      const s = new AxiosService('url', {
        type: SecurityType.API_KEY,
        apiKey: 'abc',
      });
      expect(() => s.onModuleInit()).not.toThrow();
      // @ts-ignore
      expect(s['axiosInstance'].defaults.headers.common['x-api-key']).toBe(
        'abc',
      );
    });
    it('should throw if API key missing', () => {
      const s = new AxiosService('url', { type: SecurityType.API_KEY });
      expect(() => s.onModuleInit()).toThrow('API Key no proporcionada.');
    });
    it('should set Bearer token header', () => {
      const s = new AxiosService('url', {
        type: SecurityType.BEARER_TOKEN,
        token: 'tok',
      });
      expect(() => s.onModuleInit()).not.toThrow();
      // @ts-ignore
      expect(s['axiosInstance'].defaults.headers.common['Authorization']).toBe(
        'Bearer tok',
      );
    });
    it('should throw if Bearer token missing', () => {
      const s = new AxiosService('url', { type: SecurityType.BEARER_TOKEN });
      expect(() => s.onModuleInit()).toThrow('Token JWT no proporcionado.');
    });
    it('should set Cloud Run local ID token', () => {
      const s = new AxiosService('url', {
        type: SecurityType.GOOGLE_CLOUD_RUN_AUTH,
        cloudRunIdToken: 'idtok',
      });
      expect(() => s.onModuleInit()).not.toThrow();
      // @ts-ignore
      expect(s['axiosInstance'].defaults.headers.common['Authorization']).toBe(
        'Bearer idtok',
      );
    });
    it('should throw if Cloud Run target url missing', () => {
      const s = new AxiosService('url', {
        type: SecurityType.GOOGLE_CLOUD_RUN_AUTH,
      });
      expect(() => s.onModuleInit()).toThrow(
        'URL de destino de Cloud Run no proporcionada.',
      );
    });
    it('should do nothing for NONE', () => {
      const s = new AxiosService('url', { type: SecurityType.NONE });
      expect(() => s.onModuleInit()).not.toThrow();
      // @ts-ignore
      expect(
        s['axiosInstance'].defaults.headers.common['Authorization'],
      ).toBeUndefined();
    });
    it('should throw for invalid security type', () => {
      const s = new AxiosService('url', { type: 999 as any });
      expect(() => s.onModuleInit()).toThrow('Tipo de seguridad no válido.');
    });
  });
});
