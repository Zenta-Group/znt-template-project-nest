import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MessageEntity } from './message.entity';

export type Sender = 'BOT' | 'PACIENTE';

@Entity({ name: 'confirmations' })
@Index('ix_confirmations_created_desc', ['createdDatetime'])
@Index('ix_confirmations_start_desc', ['startDatetime'])
@Index('ix_confirmations_rut', ['rut'])
@Index('ix_confirmations_phone', ['phoneNumber'])
export class ConfirmationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * IDs externos (si los hay) para poder referenciar sesiones del legacy/proveedor.
   * sessionId: ID “externo” de la sesión (en el legado: chatsession.session_id)
   * appointmentId: ID de la cita en el origen (opcional)
   */
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 128,
    nullable: true,
    unique: true,
  })
  @Index('uq_confirmations_session_id', { unique: true })
  sessionId: string | null;

  @Column({
    name: 'appointment_id',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  appointmentId: string | null;

  // Datos del paciente (para búsqueda y despliegue)
  @Column({ name: 'patient_name', type: 'varchar', length: 256 })
  patientName: string;

  @Column({ name: 'rut', type: 'varchar', length: 32 })
  rut: string; // guardar normalizado (sin puntos y con dígito verificador si aplica)

  @Column({ name: 'phone_number', type: 'varchar', length: 32 })
  phoneNumber: string; // idealmente E.164: 569XXXXXXXX

  // Servicio / Centro en texto (si no necesitas FKs a catálogos)
  @Column({ name: 'service_name', type: 'varchar', length: 256 })
  serviceName: string;

  @Column({ name: 'center_name', type: 'varchar', length: 256, nullable: true })
  centerName: string | null;

  // Fechas clave
  @Column({ name: 'created_datetime', type: 'timestamp' })
  createdDatetime: Date; // cuando se creó la sesión (legacy: chatsession.created_datetime)

  @Column({ name: 'start_datetime', type: 'timestamp', nullable: true })
  startDatetime: Date | null; // cuando empezó la conversación

  @Column({ name: 'appointment_datetime', type: 'timestamp', nullable: true })
  appointmentDatetime: Date | null; // fecha/hora de la cita (legacy: appointment.datetime_from)

  // Entrega/confirmación (si quieres reflejar un hito)
  @Column({ name: 'delivered_datetime', type: 'timestamp', nullable: true })
  deliveredDatetime: Date | null; // opcional: última entrega o confirmación

  // Para vincular con plantilla si aplica (a nivel sesión)
  @Column({ name: 'template_id', type: 'varchar', length: 128, nullable: true })
  templateId: string | null;

  // Campos de auditoría
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relación 1:N con mensajes
  @OneToMany(() => MessageEntity, (m) => m.confirmation, { cascade: true })
  messages: MessageEntity[];
}
