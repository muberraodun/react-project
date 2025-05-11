import dayjs from "dayjs";
import type { EventInput } from "@fullcalendar/core/index.js";
import type { PairInfo } from "../types";
import { getDateRange } from "./dateUtils";


export const findShiftById = (shifts: any[], id: string) => {
  return shifts?.find((shift: { id: string }) => id === shift.id);
};


export const findAssignmentById = (assignments: any[], id: string) => {
  return assignments?.find((assign: any) => id === assign.id);
};


export const findStaffById = (staffs: any[], id: string) => {
  return staffs?.find((staff: any) => id === staff.id);
};


export const generateStaffEvents = (
  selectedStaffId: string | null,
  schedule: any,
  staffColors: string[]
): EventInput[] => {
  if (!schedule || !selectedStaffId) return [];
  
  const works: EventInput[] = [];
  const validDatesList = getDateRange(schedule.scheduleStartDate, schedule.scheduleEndDate);

  const staffAssignments = schedule?.assignments?.filter(
    (assignment: any) => assignment.staffId === selectedStaffId
  );

  for (let i = 0; i < (staffAssignments?.length || 0); i++) {
    const assignmentDate = dayjs
      .utc(staffAssignments?.[i]?.shiftStart)
      .format("YYYY-MM-DD");
    const isValidDate = validDatesList.includes(assignmentDate);

    const staffIndex = schedule?.staffs?.findIndex(
      (staff: any) => staff.id === selectedStaffId
    );

    const work = {
      id: staffAssignments?.[i]?.id,
      title: findShiftById(schedule?.shifts, staffAssignments?.[i]?.shiftId)?.name,
      duration: "01:00",
      date: assignmentDate,
      staffId: staffAssignments?.[i]?.staffId,
      shiftId: staffAssignments?.[i]?.shiftId,
      backgroundColor:
        staffColors[staffIndex !== -1 ? staffIndex % staffColors.length : 0],
      borderColor:
        staffColors[staffIndex !== -1 ? staffIndex % staffColors.length : 0],
      textColor: "#ffffff",
      className: `${
        findAssignmentById(schedule?.assignments, staffAssignments?.[i]?.id)?.isUpdated
          ? "highlight"
          : ""
      } ${!isValidDate ? "invalid-date" : ""}`,
    };
    works.push(work);
  }

  return works;
};


export const checkPairsForStaff = (
  currentStaff: any,
  allStaffs: any[],
  year: number,
  month: number,
  day: number,
  staffColors: string[]
): PairInfo => {
  const currentDate = new Date(year, month - 1, day);

  if (
    currentStaff?.pairList &&
    Array.isArray(currentStaff.pairList) &&
    currentStaff.pairList.length > 0
  ) {
    for (const pair of currentStaff.pairList) {
      if (!pair.startDate || !pair.endDate || !pair.staffId) continue;

      const startParts = pair.startDate.split(".");
      const endParts = pair.endDate.split(".");

      if (startParts.length !== 3 || endParts.length !== 3) continue;

      const startDate = new Date(
        parseInt(startParts[2], 10),
        parseInt(startParts[1], 10) - 1,
        parseInt(startParts[0], 10)
      );

      const endDate = new Date(
        parseInt(endParts[2], 10),
        parseInt(endParts[1], 10) - 1,
        parseInt(endParts[0], 10)
      );

      const isInDateRange =
        currentDate >= startDate && currentDate <= endDate;

      if (isInDateRange) {
        const pairIndex = allStaffs.findIndex(
          (staff) => staff.id === pair.staffId
        );
        if (pairIndex !== -1) {
          return {
            isPaired: true,
            color: staffColors[pairIndex % staffColors.length],
          };
        }
      }
    }
  }

  for (const staff of allStaffs) {
    if (
      staff.id !== currentStaff.id &&
      staff.pairList &&
      Array.isArray(staff.pairList)
    ) {
      for (const pair of staff.pairList) {
        if (pair.staffId === currentStaff.id) {
          if (!pair.startDate || !pair.endDate) continue;

          const startParts = pair.startDate.split(".");
          const endParts = pair.endDate.split(".");

          if (startParts.length !== 3 || endParts.length !== 3) continue;

          const startDate = new Date(
            parseInt(startParts[2], 10),
            parseInt(startParts[1], 10) - 1,
            parseInt(startParts[0], 10)
          );

          const endDate = new Date(
            parseInt(endParts[2], 10),
            parseInt(endParts[1], 10) - 1,
            parseInt(endParts[0], 10)
          );

          const isInDateRange =
            currentDate >= startDate && currentDate <= endDate;

          if (isInDateRange) {
            const pairIndex = allStaffs.findIndex((s) => s.id === staff.id);
            if (pairIndex !== -1) {
              return {
                isPaired: true,
                color: staffColors[pairIndex % staffColors.length],
              };
            }
          }
        }
      }
    }
  }

  return { isPaired: false, color: "" };
}; 