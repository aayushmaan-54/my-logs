import dayjs from 'dayjs';

export default function formatShortDate(date: Date | string): string {
  return dayjs(date).format('MMM D, YYYY');
}
