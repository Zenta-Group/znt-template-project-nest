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

    const by = this.getOrderBy(orderBy);
    const dir = toDir(order === 'ASC' ? 'ASC' : 'DESC');
    const filter = this.buildBaseFilter(mode, query);
    this.applyDateFilter(filter, startDate, endDate, dateField);

    const opts: QueryOptions<any> = {
      filter,
      order: { [by]: dir } as any, // 'asc' | 'desc'
      pagination: { limit: Number(limit), offset: Number(offset) },
    };

    return this.confirmations.findMany(opts);
  }

  private getOrderBy(orderBy?: string): keyof Confirmation {
    if (orderBy && this.ORDERABLE_FIELDS.includes(orderBy as any)) {
      return orderBy as any;
    }
    return 'createdDatetime';
  }

  private buildBaseFilter(
    mode: string | undefined,
    query: any,
  ): Filter<Confirmation> {
    if (mode === 'rut') {
      return { rut: { eq: query } as any };
    }
    return { phoneNumber: { eq: query } as any };
  }

  private applyDateFilter(
    filter: Filter<Confirmation>,
    startDate?: string,
    endDate?: string,
    dateField?: string,
  ) {
    if (!startDate && !endDate) return;
    const field = (dateField || 'createdDatetime') as keyof Confirmation;
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (e < s) {
        throw new BadRequestException(
          'endDate must be greater than or equal to startDate. Minimum range is 1 day.',
        );
      }
    }
    const { startISO, endISO } = DateUtil.buildDateRangeISO(startDate, endDate);
    if (startDate && !endDate) {
      (filter as any)[field] = { gte: startISO };
    } else if (!startDate && endDate) {
      (filter as any)[field] = { lte: endISO };
    } else if (startDate && endDate) {
      (filter as any)[field] = { between: [startISO, endISO] };
    }
  }
}
