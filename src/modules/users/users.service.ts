// src/modules/users/users.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/shared/entities/user.entity';
import { IDatabaseService } from 'src/shared/interfaces/i-database-service.interface';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dtos/create-users.dto';
import { UpdateUserDto } from './dtos/update-users.dto';
import { UsersUtil } from 'src/shared/utils/users.util';
import { DocumentNotFoundException } from 'src/shared/exceptions/database-exceptions';
import { IIntegrationService } from 'src/shared/interfaces/i-integration-service.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IDatabaseService<User>,
    @Inject('EXTERNAL_API_SERVICE')
    private readonly externalApiService: IIntegrationService<any>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.id = uuid();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.name = createUserDto.name;
    user.lastname = createUserDto.lastname;
    user.documentId = createUserDto.documentId;
    user.password = await UsersUtil.hashPassword(createUserDto.password);
    user.role = createUserDto.role;
    user.status = true;

    const userRs = await this.userRepository.create(user.id, { ...user });
    delete userRs.password;
    return userRs;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.getById(id);

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

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.getAll();
    this.logger.log(`Users found: ${users.length}`);
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new DocumentNotFoundException(id);
    }
    user.email = UsersUtil.replaceIfNotEmpty<string>(
      user.email,
      updateUserDto.email,
    );
    user.username = UsersUtil.replaceIfNotEmpty<string>(
      user.username,
      updateUserDto.username,
    );
    user.name = UsersUtil.replaceIfNotEmpty<string>(
      user.name,
      updateUserDto.name,
    );
    user.lastname = UsersUtil.replaceIfNotEmpty<string>(
      user.lastname,
      updateUserDto.lastname,
    );
    user.documentId = UsersUtil.replaceIfNotEmpty<string>(
      user.documentId,
      updateUserDto.documentId,
    );
    if (updateUserDto.password) {
      user.password = await UsersUtil.hashPassword(updateUserDto.password);
    }

    user.role = UsersUtil.replaceIfNotEmpty<string>(
      user.role,
      updateUserDto.role,
    );
    user.status = UsersUtil.replaceIfNotEmpty<boolean>(
      user.status,
      updateUserDto.status,
    );

    const userRs = await this.userRepository.update(id, { ...user });
    delete userRs.password;
    return userRs;
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
