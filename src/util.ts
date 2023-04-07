import { DateTime } from "luxon";

const EST = "America/New_York";

export function formatDate(ISODateString: string) {
  return DateTime.fromISO(ISODateString)
    .setZone(EST)
    .toLocaleString(DateTime.DATETIME_MED);
}
