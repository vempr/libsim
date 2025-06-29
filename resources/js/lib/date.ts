import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export function getCurrentDateTime() {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getFormattedDate(date: string) {
  return dayjs(date).format('MMMM D, YYYY');
}

export function getRelativeTime(date: string, noSuffix?: boolean) {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow(noSuffix);
}
