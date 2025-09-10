import { UsersService } from './people.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: any;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new UsersService(repo);
  });

  it('debería crear usuario', async () => {
    repo.create.mockResolvedValue('user');
    const result = await service.createUser('Juan', 'juan@mail.com', 'admin');
    expect(repo.create).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        name: 'Juan',
        email: 'juan@mail.com',
        role: 'admin',
      }),
    );
    expect(result).toBe('user');
  });

  it('debería obtener todos los usuarios con paginación y orden', async () => {
    repo.findAll.mockResolvedValue('page');
    const params = { limit: 10, offset: 5, orderBy: 'name', order: 'DESC' };
    const result = await service.getAllUsers(params as any);
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        order: { name: 'DESC' },
        limit: 10,
        offset: 5,
      }),
    );
    expect(result).toBe('page');
  });

  it('debería usar "id" como orderBy si el campo no es válido', async () => {
    repo.findAll.mockResolvedValue('page');
    const params = { limit: 10, offset: 5, orderBy: 'noexiste', order: 'ASC' };
    await service.getAllUsers(params as any);
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        order: { id: 'ASC' },
        limit: 10,
        offset: 5,
      }),
    );
  });

  it('debería buscar usuarios por texto en name, email y role', async () => {
    repo.findAll.mockResolvedValue('page');
    const params = {
      limit: 20,
      offset: 0,
      query: 'juan',
    };
    await service.getAllUsers(params as any);
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          or: [{ name: { like: '%juan%' } }, { email: { like: '%juan%' } }],
        },
        order: { id: 'ASC' },
        limit: 20,
        offset: 0,
      }),
    );
  });

  it('debería omitir búsqueda si query está vacío', async () => {
    repo.findAll.mockResolvedValue('page');
    const params = {
      limit: 20,
      offset: 0,
      query: '   ',
    };
    await service.getAllUsers(params as any);
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        order: { id: 'ASC' },
        limit: 20,
        offset: 0,
      }),
    );
  });

  it('debería manejar búsqueda sin query parameter', async () => {
    repo.findAll.mockResolvedValue('page');
    const params = {
      limit: 10,
      offset: 5,
      orderBy: 'name',
      order: 'DESC',
    };
    const result = await service.getAllUsers(params as any);
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        order: { name: 'DESC' },
        limit: 10,
        offset: 5,
      }),
    );
    expect(result).toBe('page');
  });

  it('debería actualizar usuario con patch vacío si dto no tiene campos', async () => {
    repo.update.mockResolvedValue('user');
    const dto = {};
    const result = await service.updateUser('1', dto as any);
    expect(repo.update).toHaveBeenCalledWith('1', {});
    expect(result).toBe('user');
  });

  it('debería obtener usuario por id', async () => {
    repo.findById.mockResolvedValue('user');
    const result = await service.getUserById('1');
    expect(repo.findById).toHaveBeenCalledWith('1');
    expect(result).toBe('user');
  });

  it('debería lanzar NotFoundException si no existe usuario', async () => {
    repo.findById.mockResolvedValue(undefined);
    await expect(service.getUserById('1')).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar usuario', async () => {
    repo.update.mockResolvedValue('user');
    const dto = {
      name: 'Pedro',
      email: 'pedro@mail.com',
      role: 'lector',
      status: false,
    };
    const result = await service.updateUser('1', dto as any);
    expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining(dto));
    expect(result).toBe('user');
  });

  it('debería eliminar usuario', async () => {
    repo.delete.mockResolvedValue(undefined);
    await service.deleteUser('1');
    expect(repo.delete).toHaveBeenCalledWith('1', true);
  });
});
