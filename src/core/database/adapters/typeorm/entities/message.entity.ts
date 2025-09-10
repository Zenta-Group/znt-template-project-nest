import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ConfirmationEntity } from './confirmation.entity';

export type Sender = 'BOT' | 'PACIENTE';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

@Entity({ name: 'messages' })
@Index('ix_messages_by_confirmation_time', ['confirmationId', 'timestamp'])
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK a tabla principal
  @Column({ name: 'confirmation_id', type: 'uuid' })
  confirmationId: string;

  @ManyToOne(() => ConfirmationEntity, (c) => c.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'confirmation_id' })
  confirmation: ConfirmationEntity;

  // Quién lo envió
  @Column({ name: 'sender', type: 'varchar', length: 16 })
  sender: Sender; // 'BOT' | 'PACIENTE'

  // Contenido del mensaje:
  // - Si messageText es null, puedes usar templateText + variables para renderizar en UI
  @Column({ name: 'message_text', type: 'text', nullable: true })
  messageText: string | null;

  // Para soportar plantillas + variables (legacy)
  @Column({ name: 'template_id', type: 'varchar', length: 128, nullable: true })
  templateId: string | null;

  @Column({ name: 'template_text', type: 'text', nullable: true })
  templateText: string | null;

  @Column({ name: 'variables', type: 'json', nullable: true })
  variables: any | null;

  // Estado "actual" del mensaje (si decides normalizarlo aquí para acceso rápido)
  @Column({ name: 'status', type: 'varchar', length: 16, nullable: true })
  status: MessageStatus | null;

  // Marca temporal del mensaje
  @Column({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date;

  // ID externo del proveedor, por si necesitas idempotencia
  @Column({
    name: 'external_id',
    type: 'varchar',
    length: 128,
    nullable: true,
    unique: true,
  })
  externalId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
