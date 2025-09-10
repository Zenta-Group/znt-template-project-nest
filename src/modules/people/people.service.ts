import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { UpdatePeopleDto } from './dtos/update-people.dto';
import { UsersUtil } from 'src/shared/utils/users.util';
import { Person } from 'src/shared/models/person.model';
import { IBaseRepository } from 'src/shared/interfaces/repository.ports';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { IIntegrationService } from 'src/shared/interfaces/i-integration-service.interface';

@Injectable()
export class PeopleService {
  private readonly ORDERABLE_FIELDS: Array<keyof Person> = [
    'id',
    'name',
    'email',
    'role',
    'status',
  ];

  constructor(
    @Inject('PERSON_REPO')
    private readonly people: IBaseRepository<Person, any, string>,
    @Inject('CLOUD_RUN_API_SERVICE')
    private readonly cloudRunApiService: IIntegrationService<any>,
  ) {}

  async createUser(name: string, email: string, role: 'USER' | 'ADMIN') {
    // Creates a new user with the given name, email, and role
    const id = uuid();
    return this.people.createWithId(id, {
      id,
      name,
      email,
      role,
      status: true,
    });
  }

  async getAllUsers(params: PaginationQueryDto) {
    // Returns all users with optional text search and pagination
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;
    const by = this.ORDERABLE_FIELDS.includes(params.orderBy as keyof Person)
      ? (params.orderBy as keyof Person)
      : ('id' as keyof Person);
    const dir: 'ASC' | 'DESC' = params.order === 'DESC' ? 'DESC' : 'ASC';
    let whereConditions: any = {};
    if (params.query) {
      const searchQuery = params.query.trim();
      if (searchQuery) {
        const matchingRoles = UsersUtil.findMatchingRoles(searchQuery);
        whereConditions = {
          or: [
            { name: { like: `%${searchQuery}%` } },
            { email: { like: `%${searchQuery}%` } },
            ...matchingRoles.map((role) => ({ role })),
          ],
        };
      }
    }
    const opts = {
      where: whereConditions,
      order: { [by]: dir } as any,
      limit,
      offset,
    };
    const result = await this.people.findMany(opts);
    await Promise.all(
      result.data.map(async (person) => {
        person.additionalData = await this.cloudRunApiService.get(`/dummy`);
      }),
    );
    return result;
  }

  async getUserById(id: string): Promise<Person> {
    // Returns a user by ID, throws if not found
    const user = await this.people.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async updateUser(id: string, dto: UpdatePeopleDto): Promise<Person> {
    // Updates user fields by ID
    const patch: Partial<Person> = {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.role !== undefined ? { role: dto.role } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    };
    return this.people.update(id, patch);
  }

  async deleteUser(id: string): Promise<void> {
    await this.people.delete(id, { hard: true });
  }
}
