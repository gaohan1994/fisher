import dayjs from 'dayjs/esm/index.js';
import durationPlugin from 'dayjs/esm/plugin/duration';
import relativeTimePlugin from 'dayjs/esm/plugin/relativeTime';
import { MaxHangUpTimeMs } from './Constants.js';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);

class HangUpTime {
  public startTime: dayjs.Dayjs;

  public startTimeFormat: string;

  public endTime: dayjs.Dayjs;

  public endTimeFormat: string;

  public diff: number;

  public duration: durationPlugin.Duration;

  public durationFormat;

  constructor(startTime: number) {
    this.startTime = dayjs(startTime);
    this.startTimeFormat = this.startTime.format('YYYY-MM-DD HH:mm:ss');

    this.endTime = dayjs();
    this.endTimeFormat = this.endTime.format('YYYY-MM-DD HH:mm:ss');

    this.diff = Math.min(MaxHangUpTimeMs, this.endTime.diff(this.startTime, 'ms'));
    this.duration = dayjs.duration(this.diff);
    this.durationFormat = `${this.duration.days()}天 ${this.duration.hours()}小时 ${this.duration.minutes()}分 ${this.duration.seconds()}秒`;
  }
}

export { HangUpTime };
