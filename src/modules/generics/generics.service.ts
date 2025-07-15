// src/modules/users/users.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDatabaseService } from 'src/shared/interfaces/i-database-service.interface';
import { v4 as uuid } from 'uuid';
import { DocumentNotFoundException } from 'src/shared/exceptions/database-exceptions';
import { Generic } from 'src/shared/entities/generic.entity';
import { CreateGenericDto } from './dtos/create-generic.dto';
import { UpdateGenericDto } from './dtos/update-generic.dto';

@Injectable()
export class GenericsService {
  private readonly logger = new Logger(GenericsService.name);

  constructor(
    @Inject('GENERIC_REPOSITORY')
    private readonly genericsRepository: IDatabaseService<Generic>,
  ) {}

  async create(createGenericDto: CreateGenericDto): Promise<Generic> {
    const obj = new Generic();
    obj.id = uuid();
    obj.name = createGenericDto.name;
    obj.description = createGenericDto.description;
    obj.date = new Date();
    obj.status = 'Pendiente';

    const response = await this.genericsRepository.create(obj.id, { ...obj });
    return response;
  }

  async getById(id: string): Promise<Generic | null> {
    const obj = await this.genericsRepository.getById(id);
    if (obj) {
      return obj;
    }
    throw new DocumentNotFoundException(id);
  }

  async getAll(): Promise<Generic[]> {
    const objs = await this.genericsRepository.getAll();
    this.logger.log(`Records found: ${objs.length}`);
    return objs;
  }

  async update(id: string, updateGenericDto: UpdateGenericDto): Promise<Generic> {
    const obj = await this.genericsRepository.getById(id);
    if (!obj) {
      throw new DocumentNotFoundException(id);
    }
    obj.name = updateGenericDto.name;
    obj.description = updateGenericDto.description;
    obj.date = new Date();
    obj.status = updateGenericDto.status;

    const response = await this.genericsRepository.update(id, { ...obj });
    return response;
  }

  async delete(id: string): Promise<void> {
    return this.genericsRepository.delete(id);
  }
}
