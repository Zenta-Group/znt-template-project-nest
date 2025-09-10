import { PeopleController } from './people.controller';
import { PersonDto } from './dtos/person.dto';
import { PersonPageDto } from './dtos/person-page.dto';

describe('PeopleController', () => {
  let controller: PeopleController;
  let service: any;

  beforeEach(() => {
    service = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };
    controller = new PeopleController(service);
  });
  const ADMIN = 'ADMIN';
  const USER = 'USER';

  it('debería crear usuario', async () => {
    const userMock = {
      id: '1',
      name: 'Juan',
      email: 'juan@mail.com',
      role: ADMIN as 'ADMIN',
      status: true,
    };
    service.createUser.mockResolvedValue(userMock);
    const dto = {
      name: 'Juan',
      email: 'juan@mail.com',
      role: ADMIN,
    } as any;
    const result = await controller.create(dto);
    expect(service.createUser).toHaveBeenCalledWith(
      'Juan',
      'juan@mail.com',
      'ADMIN',
    );
    expect(result).toEqual(PersonDto.fromDomain(userMock));
  });

  it('debería crear usuario con rol inválido y asignar "USER"', async () => {
    const userMock = {
      id: '2',
      name: 'Ana',
      email: 'ana@mail.com',
      role: USER as 'USER',
      status: true,
    };
    service.createUser.mockResolvedValue(userMock);
    const dto = {
      name: 'Ana',
      email: 'ana@mail.com',
      role: 'otro' as any,
    } as any;
    const result = await controller.create(dto);
    expect(service.createUser).toHaveBeenCalledWith(
      'Ana',
      'ana@mail.com',
      'USER',
    );
    expect(result).toEqual(PersonDto.fromDomain(userMock));
  });

  it('debería manejar error al crear usuario', async () => {
    service.createUser.mockRejectedValue(new Error('fail'));
    const dto = { name: 'Ana', email: 'ana@mail.com', role: 'ADMIN' } as any;
    await expect(controller.create(dto)).rejects.toThrow('fail');
  });

  it('debería manejar error al buscar usuario', async () => {
    service.getUserById.mockRejectedValue(new Error('fail'));
    await expect(controller.findOne('1')).rejects.toThrow('fail');
  });

  it('debería manejar error al actualizar usuario', async () => {
    service.updateUser.mockRejectedValue(new Error('fail'));
    await expect(
      controller.update('1', { name: 'Pedro' } as any),
    ).rejects.toThrow('fail');
  });

  it('debería manejar error al eliminar usuario', async () => {
    service.deleteUser.mockRejectedValue(new Error('fail'));
    await expect(controller.remove('1')).rejects.toThrow('fail');
  });

  it('debería listar usuarios', async () => {
    const userMock = {
      id: '1',
      name: 'Juan',
      email: 'juan@mail.com',
      role: ADMIN as 'ADMIN',
      status: true,
    };
    const page = { data: [userMock], total: 1, limit: 10, offset: 0 };
    service.getAllUsers.mockResolvedValue(page);
    const result = await controller.findAll({ limit: 10, offset: 0 } as any);
    expect(service.getAllUsers).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    expect(result).toEqual(
      PersonPageDto.from([PersonDto.fromDomain(userMock)], 1, 10, 0),
    );
  });

  it('debería obtener usuario por id', async () => {
    const userMock = {
      id: '1',
      name: 'Juan',
      email: 'juan@mail.com',
      role: ADMIN as 'ADMIN',
      status: true,
    };
    service.getUserById.mockResolvedValue(userMock);
    const result = await controller.findOne('1');
    expect(service.getUserById).toHaveBeenCalledWith('1');
    expect(result).toEqual(PersonDto.fromDomain(userMock));
  });

  it('debería actualizar usuario', async () => {
    const userMock = {
      id: '1',
      name: 'Pedro',
      email: 'pedro@mail.com',
      role: USER as 'USER',
      status: false,
    };
    service.updateUser.mockResolvedValue(userMock);
    const result = await controller.update('1', { name: 'Pedro' } as any);
    expect(service.updateUser).toHaveBeenCalledWith('1', { name: 'Pedro' });
    expect(result).toEqual(PersonDto.fromDomain(userMock));
  });

  it('debería eliminar usuario', async () => {
    service.deleteUser.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(service.deleteUser).toHaveBeenCalledWith('1');
  });
});
