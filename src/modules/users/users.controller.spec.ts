import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CsrfInterceptor } from '../../shared/interceptors/csrf.interceptor';
import { CsrfService } from '../../shared/services/csrf.service';
import { CreateUserDto } from './dtos/create-users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    usersService = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      getAllUsers: jest.fn(),
      // ...otros métodos mockeados si es necesario
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: CsrfService, useValue: { validateCsrfToken: jest.fn() } },
      ],
    })
      .overrideInterceptor(CsrfInterceptor)
      .useValue({ intercept: jest.fn((_, next) => next.handle()) })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test',
      lastname: 'User',
      documentId: '123',
      password: 'pass',
      role: 'USER',
    };
    const user = { ...dto, id: '1', status: true };
    usersService.createUser.mockResolvedValue(user as any);
    const result = await controller.create(dto);
    expect(result).toEqual(
      expect.objectContaining({
        id: '1',
        email: dto.email,
        username: dto.username,
        name: dto.name,
        lastname: dto.lastname,
        documentId: dto.documentId,
        status: true,
        role: dto.role,
      }),
    );
    expect(usersService.createUser).toHaveBeenCalledWith(dto);
  });
});
