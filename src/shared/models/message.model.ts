export type Sender = 'BOT' | 'PACIENTE';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface Message {
  id: string;
  confirmationId: string;
  sender: Sender;
  text?: string | null;
  templateId?: string | null;
  templateText?: string | null;
  variables?: Record<string, any> | null;
  status?: MessageStatus | null;
  timestamp: Date;
  externalId?: string | null;
}
