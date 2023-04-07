import { DateTime } from "luxon";

export function formatDate(ISODateString: string) {
  return DateTime.fromISO(ISODateString).toLocaleString(DateTime.DATETIME_MED);
}
