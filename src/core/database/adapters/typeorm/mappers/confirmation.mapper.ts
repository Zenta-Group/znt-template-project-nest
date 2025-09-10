import { IEntityMapper } from 'src/shared/interfaces/repository.ports';
import { Confirmation } from 'src/shared/models/confirmation.model';
import { ConfirmationEntity } from '../entities/confirmation.entity';

export const confirmationMapper: IEntityMapper<
  Confirmation,
  ConfirmationEntity
> = {
  toDomain(p: ConfirmationEntity): Confirmation {
    return {
      id: p.id,
      sessionId: p.sessionId ?? null,
      appointmentId: p.appointmentId ?? null,
      patientName: p.patientName,
      rut: p.rut,
      phoneNumber: p.phoneNumber,
      serviceName: p.serviceName,
      centerName: p.centerName ?? null,
      createdDatetime: p.createdDatetime ? p.createdDatetime : null,
      startDatetime: p.startDatetime ? p.startDatetime : null,
      appointmentDatetime: p.appointmentDatetime ? p.appointmentDatetime : null,
      deliveredDatetime: p.deliveredDatetime ? p.deliveredDatetime : null,
      templateId: p.templateId ?? null,
    };
  },

  toPersistence(d: Confirmation): ConfirmationEntity {
    return {
      id: d.id,
      sessionId: d.sessionId ?? null,
      appointmentId: d.appointmentId ?? null,
      patientName: d.patientName,
      rut: d.rut,
      phoneNumber: d.phoneNumber,
      serviceName: d.serviceName,
      centerName: d.centerName ?? null,
      createdDatetime: new Date(d.createdDatetime),
      startDatetime: d.startDatetime ? new Date(d.startDatetime) : null,
      appointmentDatetime: d.appointmentDatetime
        ? new Date(d.appointmentDatetime)
        : null,
      deliveredDatetime: d.deliveredDatetime
        ? new Date(d.deliveredDatetime)
        : null,
      templateId: d.templateId ?? null,
      messages: undefined as any,
      createdAt: undefined as any,
      updatedAt: undefined as any,
    } as unknown as ConfirmationEntity;
  },
};
