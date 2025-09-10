// src/modules/users/users.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/shared/models/user.model';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dtos/create-users.dto';
import { UpdateUserDto } from './dtos/update-users.dto';
import { UsersUtil } from 'src/shared/utils/users.util';
import { DocumentNotFoundException } from 'src/shared/exceptions/database-exceptions';
import { IIntegrationService } from 'src/shared/interfaces/i-integration-service.interface';
import { IBaseRepository, Page } from 'src/shared/interfaces/repository.ports';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IBaseRepository<User, any, string>,
    @Inject('EXTERNAL_API_SERVICE')
    private readonly externalApiService: IIntegrationService<any>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      id: uuid(),
      email: createUserDto.email,
      username: createUserDto.username,
      name: createUserDto.name,
      lastname: createUserDto.lastname,
      documentId: createUserDto.documentId,
      password: await UsersUtil.hashPassword(createUserDto.password),
      role: createUserDto.role,
      status: true,
    };

    const userRs = await this.userRepository.createWithId(user.id, user);
    delete userRs.password;
    return userRs;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);

    if (user) {
      delete user.password;

      const params = {
        postId: 1,
      };
      const comments = await this.externalApiService.get(`/comments`, params);
      user.aditionalData = comments;

      return user;
    }
    throw new DocumentNotFoundException(id);
  }

  async getAllUsers(): Promise<Page<User>> {
    const users = await this.userRepository.findMany();
    this.logger.log(`Users found: ${users.total}`);
    return users;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Actualiza los campos del usuario por ID usando los utils y spread
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new DocumentNotFoundException(id);
    }

    const patch: Partial<User> = {
      ...(updateUserDto.email !== undefined
        ? {
            email: UsersUtil.replaceIfNotEmpty(user.email, updateUserDto.email),
          }
        : {}),
      ...(updateUserDto.username !== undefined
        ? {
            username: UsersUtil.replaceIfNotEmpty(
              user.username,
              updateUserDto.username,
            ),
          }
        : {}),
      ...(updateUserDto.name !== undefined
        ? { name: UsersUtil.replaceIfNotEmpty(user.name, updateUserDto.name) }
        : {}),
      ...(updateUserDto.lastname !== undefined
        ? {
            lastname: UsersUtil.replaceIfNotEmpty(
              user.lastname,
              updateUserDto.lastname,
            ),
          }
        : {}),
      ...(updateUserDto.documentId !== undefined
        ? {
            documentId: UsersUtil.replaceIfNotEmpty(
              user.documentId,
              updateUserDto.documentId,
            ),
          }
        : {}),
      ...(updateUserDto.role !== undefined
        ? { role: UsersUtil.replaceIfNotEmpty(user.role, updateUserDto.role) }
        : {}),
      ...(updateUserDto.status !== undefined
        ? {
            status: UsersUtil.replaceIfNotEmpty(
              user.status,
              updateUserDto.status,
            ),
          }
        : {}),
    };

    if (updateUserDto.password) {
      patch.password = await UsersUtil.hashPassword(updateUserDto.password);
    }

    const userRs = await this.userRepository.update(id, patch);
    delete userRs.password;
    return userRs;
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
