import { Inject, Injectable } from '@nestjs/common';
import { SearchMessagesDto } from './dtos/search-messages.dto';
import {
  Filter,
  IBaseRepository,
  QueryOptions,
} from 'src/shared/interfaces/repository.ports';
import { Message } from 'src/shared/models/message.model';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGE_REPO')
    private readonly messages: IBaseRepository<Message, any, string>,
  ) {}

  /**
   * Returns messages by confirmation_id with pagination
   */
  async getMessages(params: SearchMessagesDto) {
    const { offset, limit, confirmation_id } = params;
    if (!confirmation_id) {
      throw new Error('confirmation_id is required');
    }
    const filter: Filter<Message> = {
      confirmationId: { eq: confirmation_id } as any,
    };

    const opts: QueryOptions<any> = {
      filter,
      order: { timestamp: 'desc' } as any,
      pagination: { limit: Number(limit), offset: Number(offset) },
    };

    const results = await this.messages.findMany(opts);
    return results;
  }
}
