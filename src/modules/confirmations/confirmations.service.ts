import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { SearchConfirmationsDto } from './dtos/search-confirmations.dto';
import {
  Filter,
  IBaseRepository,
  Page,
  QueryOptions,
} from 'src/shared/interfaces/repository.ports';
import { Confirmation } from 'src/shared/models/confirmation.model';
import { DateUtil } from 'src/shared/utils/date.util';

type Dir = 'ASC' | 'DESC';
const toDir = (d?: Dir): 'asc' | 'desc' => (d === 'ASC' ? 'asc' : 'desc');

@Injectable()
export class ConfirmationsService {
  private readonly logger = new Logger(ConfirmationsService.name);
  private readonly ORDERABLE_FIELDS: Array<keyof Confirmation> = [
    'id',
    'sessionId',
    'appointmentId',
    'patientName',
    'rut',
    'phoneNumber',
    'serviceName',
    'centerName',
    'createdDatetime',
    'startDatetime',
    'appointmentDatetime',
    'deliveredDatetime',
    'templateId',
  ];

  constructor(
    @Inject('CONFIRMATION_REPO')
    private readonly confirmations: IBaseRepository<Confirmation, any, string>,
  ) {}

  async search(params: SearchConfirmationsDto) {
    const {
      mode,
      query,
      offset = 0,
      limit = 10,
      startDate,
      endDate,
      dateField,
      order,
      orderBy,
    } = params;

    let by: keyof Confirmation = 'createdDatetime';
    if (orderBy && this.ORDERABLE_FIELDS.includes(orderBy as any))
      by = orderBy as any;
    const dir = toDir(order === 'ASC' ? 'ASC' : 'DESC');

    const filter: Filter<Confirmation> =
      mode === 'rut'
        ? { rut: { eq: query } as any }
        : { phoneNumber: { eq: query } as any };

    if (startDate || endDate) {
      const field = (dateField || 'createdDatetime') as keyof Confirmation;
      if (startDate && endDate) {
        const s = new Date(startDate);
        const e = new Date(endDate);
        if (e < s)
          throw new BadRequestException(
            'endDate must be greater than or equal to startDate. Minimum range is 1 day.',
          );
      }
      const { startISO, endISO } = DateUtil.buildDateRangeISO(
        startDate,
        endDate,
      );

      if (startDate && !endDate) {
        (filter as any)[field] = { gte: startISO };
      } else if (!startDate && endDate) {
        (filter as any)[field] = { lte: endISO };
      } else if (startDate && endDate) {
        (filter as any)[field] = { between: [startISO, endISO] };
      }
    }

    const opts: QueryOptions<any> = {
      filter,
      order: { [by]: dir } as any, // 'asc' | 'desc'
      pagination: { limit: Number(limit), offset: Number(offset) },
    };

    const page = await this.confirmations.findMany(opts);
    return page;
  }
}
