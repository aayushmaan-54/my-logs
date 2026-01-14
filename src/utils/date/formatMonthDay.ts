import dayjs from 'dayjs';

export default function formatMonthDay(date: Date): string {
  return dayjs(date).format('MMM D');
}
