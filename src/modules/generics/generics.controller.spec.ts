import { Test, TestingModule } from '@nestjs/testing';
import { GenericsController } from './generics.controller';
import { GenericsService } from './generics.service';
import { CreateGenericDto } from './dtos/create-generic.dto';
import { GenericDto } from 'src/shared/dtos/generic.dto';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';
import { CsrfService } from 'src/shared/services/csrf.service';

describe('GenericsController', () => {
  let controller: GenericsController;
  let service: GenericsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenericsController],
      providers: [
        {
          provide: GenericsService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CsrfService,
          useValue: { validateCsrfToken: jest.fn() },
        },
      ],
    })
      .overrideInterceptor(CsrfInterceptor)
      .useValue({ intercept: jest.fn() })
      .compile();
    controller = module.get<GenericsController>(GenericsController);
    service = module.get<GenericsService>(GenericsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a generic', async () => {
    const dto: CreateGenericDto = {
      name: 'test',
      description: 'desc',
      status: 'Pendiente',
    };
    const domain = {
      id: '1',
      name: 'test',
      description: 'desc',
      date: new Date(),
      status: 'Pendiente',
    };
    const result: GenericDto = { ...domain };
    jest.spyOn(service, 'create').mockResolvedValue(domain as any);
    jest.spyOn(GenericDto, 'fromDomain').mockReturnValue(result);
    expect(await controller.create(dto)).toEqual(result);
  });

  it('should get all generics', async () => {
    const domain = {
      id: '1',
      name: 'test',
      description: 'desc',
      date: new Date(),
      status: 'Pendiente',
    };
    const page = { total: 1, data: [domain] };
    jest.spyOn(service, 'getAll').mockResolvedValue(page as any);
    jest.spyOn(GenericDto, 'fromDomain').mockImplementation((g) => g as any);
    expect(await controller.findAll()).toEqual([domain]);
  });

  it('should get generic by id', async () => {
    const domain = {
      id: '1',
      name: 'test',
      description: 'desc',
      date: new Date(),
      status: 'Pendiente',
    };
    const result: GenericDto = { ...domain };
    jest.spyOn(service, 'getById').mockResolvedValue(domain as any);
    jest.spyOn(GenericDto, 'fromDomain').mockReturnValue(result);
    expect(await controller.findOne('1')).toEqual(result);
  });

  it('should throw if getById fails', async () => {
    jest.spyOn(service, 'getById').mockRejectedValue(new Error('Not found'));
    await expect(controller.findOne('1')).rejects.toThrow('Not found');
  });

  it('should update a generic', async () => {
    const id = '1';
    const updateDto = {
      name: 'updated',
      description: 'desc',
      status: 'Pendiente',
    };
    const domain = { id, ...updateDto, date: new Date() };
    const result: GenericDto = { ...domain };
    jest.spyOn(service, 'update').mockResolvedValue(domain as any);
    jest.spyOn(GenericDto, 'fromDomain').mockReturnValue(result);
    expect(await controller.update(id, updateDto)).toEqual(result);
  });

  it('should throw if update fails', async () => {
    jest.spyOn(service, 'update').mockRejectedValue(new Error('Update error'));
    await expect(
      controller.update('1', {
        name: 'n',
        description: 'd',
        status: 'Pendiente',
      }),
    ).rejects.toThrow('Update error');
  });

  it('should remove a generic', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue(undefined);
    await expect(controller.remove('1')).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith('1');
  });
});
