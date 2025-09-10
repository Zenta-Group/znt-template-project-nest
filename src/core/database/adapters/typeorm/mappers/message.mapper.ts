import { IEntityMapper } from 'src/shared/interfaces/repository.ports';
import { Message } from 'src/shared/models/message.model';
import { MessageEntity } from '../entities/message.entity';

export const messageMapper: IEntityMapper<Message, MessageEntity> = {
  toDomain(p: MessageEntity): Message {
    return {
      id: p.id,
      confirmationId: p.confirmationId,
      sender: p.sender,
      text: p.messageText ?? null,
      templateId: p.templateId ?? null,
      templateText: p.templateText ?? null,
      variables: (p.variables as any) ?? null,
      status: p.status ?? null,
      timestamp: p.timestamp ? p.timestamp : null,
      externalId: p.externalId ?? null,
    };
  },

  toPersistence(d: Message): MessageEntity {
    return {
      id: d.id,
      confirmationId: d.confirmationId,
      sender: d.sender,
      messageText: d.text ?? null,
      templateId: d.templateId ?? null,
      templateText: d.templateText ?? null,
      variables: (d.variables as any) ?? null,
      status: d.status ?? null,
      timestamp: new Date(d.timestamp),
      externalId: d.externalId ?? null,
      confirmation: undefined as any,
      createdAt: undefined as any,
    } as unknown as MessageEntity;
  },
};
