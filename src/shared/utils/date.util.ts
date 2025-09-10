import { DateTime } from 'luxon';

const ZONE = 'America/Santiago';

export class DateUtil {
  /**
   * Builds an ISO date range for filtering by start and end date
   */
  static buildDateRangeISO(startDate?: string, endDate?: string) {
    const startISO = startDate
      ? DateTime.fromISO(startDate, { zone: ZONE })
          .startOf('day')
          .toISO({ suppressMilliseconds: false })
      : undefined;
    const endISO = (
      endDate
        ? DateTime.fromISO(endDate, { zone: ZONE })
        : DateTime.now().setZone(ZONE)
    )
      .endOf('day')
      .toISO({ suppressMilliseconds: false });
    return { startISO, endISO };
  }
}
