import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-users.dto';
import { IBaseRepository } from '../../shared/interfaces/repository.ports';
import { IIntegrationService } from '../../shared/interfaces/i-integration-service.interface';
import { User } from '../../shared/models/user.model';
import { UsersUtil } from '../../shared/utils/users.util';
import { DocumentNotFoundException } from '../../shared/exceptions/database-exceptions';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<IBaseRepository<User, any, string>>;
  let externalApiService: jest.Mocked<IIntegrationService<any>>;

  beforeEach(async () => {
    userRepository = {
      createWithId: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      // ...otros métodos mockeados si es necesario
    } as any;
    externalApiService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'USER_REPOSITORY', useValue: userRepository },
        { provide: 'EXTERNAL_API_SERVICE', useValue: externalApiService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and remove password from result', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test',
      lastname: 'User',
      documentId: '123',
      password: 'pass',
      role: 'USER',
    };
    const hashed = 'hashedpass';
    jest.spyOn(UsersUtil, 'hashPassword').mockResolvedValue(hashed);
    const userResult: User = {
      ...dto,
      id: '1',
      password: hashed,
      status: true,
    };
    userRepository.createWithId.mockResolvedValue({ ...userResult });
    const result = await service.createUser(dto);
    expect(result.password).toBeUndefined();
    expect(userRepository.createWithId).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ email: dto.email }),
    );
  });

  it('should get user by id and add aditionalData', async () => {
    const user: User = {
      id: '1',
      email: 'a@a.com',
      username: 'a',
      name: 'A',
      lastname: 'B',
      documentId: '123',
      password: 'secret',
      status: true,
    };
    userRepository.findById.mockResolvedValue({ ...user });
    externalApiService.get.mockResolvedValue([{ comment: 'ok' }]);
    const result = await service.getUserById('1');
    expect(result).toBeDefined();
    expect(result?.password).toBeUndefined();
    expect(result?.aditionalData).toBeDefined();
  });

  it('should throw DocumentNotFoundException if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);
    await expect(service.getUserById('notfound')).rejects.toBeInstanceOf(
      DocumentNotFoundException,
    );
  });

  it('should get all users and log total', async () => {
    const usersPage = { total: 2, data: [] };
    userRepository.findMany.mockResolvedValue(usersPage as any);
    const result = await service.getAllUsers();
    expect(result).toBe(usersPage);
  });
});
