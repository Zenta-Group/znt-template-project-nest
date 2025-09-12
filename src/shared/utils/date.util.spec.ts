import { DateUtil } from './date.util';

describe('DateUtil', () => {
  it('should build date range ISO', () => {
    const { startISO, endISO } = DateUtil.buildDateRangeISO(
      '2023-01-01',
      '2023-01-02',
    );
    expect(startISO).toContain('2023-01-01');
    expect(endISO).toContain('2023-01-02');
  });

  it('should handle undefined dates', () => {
    const { endISO } = DateUtil.buildDateRangeISO();
    expect(endISO).toBeDefined();
  });
});
