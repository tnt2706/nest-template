import * as moment from 'moment-timezone';
const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';
const INVOICE_DATE_FORMAT = 'YYYY-MM-DD';
const BAILIFF_INVOICE_DATE_FORMAT = 'MM-YYYY';
export class DateTimeHelper {
  static now(): number {
    return Number(moment().format('x'));
  }

  static getFirstDateOfCurrentMonth(): number {
    return Number(
      moment()
        .startOf('month')
        .format('x'),
    );
  }

  static getLastDateOfCurrentMonth(): number {
    return Number(
      moment()
        .endOf('month')
        .format('x'),
    );
  }

  static isValidTimezone(timezone: string): boolean {
    return moment.tz.zone(timezone) != null;
  }

  static guessTimeZoneName(): string {
    return moment.tz.guess();
  }

  static convertToDisplay(
    timestamp: string,
    timezone: string,
    format?: string | null,
  ): string {
    const timeFormat = format ? format : DEFAULT_DATE_FORMAT;

    return this.isValidTimezone(timezone)
      ? moment(`${timestamp}`, 'x')
          .tz(timezone)
          .format(timeFormat)
      : moment(`${timestamp}`, 'x').format(timeFormat);
  }

  static generateInvDate(timezone: string): string {
    return DateTimeHelper.convertToDisplay(
      String(new Date().getTime()),
      timezone,
      INVOICE_DATE_FORMAT,
    );
  }

  static getFirstAndLastDayOfPreviousMonth(): number[] {
    return [
      this.getFirstDayOfPreviousMonth(),
      this.getLastDayOfPreviousMonth(),
    ];
  }

  static getFirstDayOfPreviousMonth(): number {
    return Number(
      moment()
        .subtract(1, 'months')
        .startOf('month')
        .format('x'),
    );
  }

  static getLastDayOfPreviousMonth(): number {
    return Number(
      moment()
        .subtract(1, 'months')
        .endOf('month')
        .format('x'),
    );
  }

  static generateInvDateForBailiff(timezone: string): string {
    return DateTimeHelper.convertToDisplay(
      String(new Date().getTime()),
      timezone,
      BAILIFF_INVOICE_DATE_FORMAT,
    );
  }
}
