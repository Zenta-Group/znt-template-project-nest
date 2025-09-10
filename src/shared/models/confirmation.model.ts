export type Sender = 'BOT' | 'PACIENTE';

export interface Confirmation {
  id: string;
  sessionId?: string | null;
  appointmentId?: string | null;
  patientName: string;
  rut: string;
  phoneNumber: string;
  serviceName: string;
  centerName?: string | null;
  createdDatetime: Date;
  startDatetime?: Date | null;
  appointmentDatetime?: Date | null;
  deliveredDatetime?: Date | null;
  templateId?: string | null;
}
