import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let currentDate = dayjs(startDate);
  
  while (
    currentDate.isBefore(endDate) ||
    currentDate.isSame(endDate)
  ) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }

  return dates;
};

export const getDatesBetween = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = dayjs(startDate, "DD.MM.YYYY").toDate();
  const end = dayjs(endDate, "DD.MM.YYYY").toDate();
  const current = new Date(start);

  while (current <= end) {
    dates.push(dayjs(current).format("DD-MM-YYYY"));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const getInitialCalendarDate = (shiftStartDate: string): Date => {
  return dayjs(shiftStartDate).startOf("month").toDate();
}; 