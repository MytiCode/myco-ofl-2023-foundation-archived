import { DateTime } from "luxon";

export function formatDate(ISODateString: string) {
  return DateTime.fromISO(ISODateString).toLocaleString(DateTime.DATETIME_MED);
}

export function isLast(arr: any[], index: number) {
  return index + 1 === arr.length;
}
