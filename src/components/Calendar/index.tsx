/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

import type { ScheduleInstance } from "../../models/schedule";
import type { UserInstance } from "../../models/user";

import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import type { EventInput } from "@fullcalendar/core/index.js";

import "../profileCalendar.scss";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { staffColors } from "../../constants/staffColors";
import type { AnyAction } from "redux";
import { useAppDispatch } from "../../store/hooks";
import { updateAssignment } from "../../store/schedule/actions";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

type CalendarContainerProps = {
  schedule: ScheduleInstance;
  auth: UserInstance;
};

const CalendarContainer = ({ schedule, auth }: CalendarContainerProps) => {
  const calendarRef = useRef<FullCalendar>(null);

  const [events, setEvents] = useState<EventInput[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleEventDrop = (eventDropInfo: any) => {
    eventDropInfo.jsEvent?.preventDefault();

    const eventId = eventDropInfo.event.id;

    const newDate = dayjs(eventDropInfo.event.start).format("YYYY-MM-DD");

    const assignment = schedule?.assignments?.find(
      (assign) => assign.id === eventId
    );

    if (assignment) {
      const originalTime = dayjs(assignment.shiftStart).format("HH:mm:ss");
      const newShiftStart = `${newDate}T${originalTime}`;

      dispatch(
        updateAssignment({
          id: eventId,
          shiftStart: newShiftStart,
        }) as AnyAction
      );
    }
  };

  const getPlugins = () => {
    const plugins = [dayGridPlugin];

    plugins.push(interactionPlugin);
    return plugins;
  };

  const getShiftById = (id: string) => {
    return schedule?.shifts?.find((shift: { id: string }) => id === shift.id);
  };

  const getAssigmentById = (id: string) => {
    return schedule?.assignments?.find((assign) => id === assign.id);
  };

  const getStaffById = (id: string) => {
    return schedule?.staffs?.find((staff) => id === staff.id);
  };

  const validDates = () => {
    const dates = [];
    let currentDate = dayjs(schedule.scheduleStartDate);
    while (
      currentDate.isBefore(schedule.scheduleEndDate) ||
      currentDate.isSame(schedule.scheduleEndDate)
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    const start = dayjs(startDate, "DD.MM.YYYY").toDate();
    const end = dayjs(endDate, "DD.MM.YYYY").toDate();
    const current = new Date(start);

    while (current <= end) {
      dates.push(dayjs(current).format("DD-MM-YYYY"));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const generateStaffBasedCalendar = () => {
    if (!schedule || !selectedStaffId) return;

    const works: EventInput[] = [];

    const staffAssignments = schedule?.assignments?.filter(
      (assignment) => assignment.staffId === selectedStaffId
    );

    for (let i = 0; i < (staffAssignments?.length || 0); i++) {
      const assignmentDate = dayjs
        .utc(staffAssignments?.[i]?.shiftStart)
        .format("YYYY-MM-DD");
      const isValidDate = validDates().includes(assignmentDate);

      const staffIndex = schedule?.staffs?.findIndex(
        (staff) => staff.id === selectedStaffId
      );

      const work = {
        id: staffAssignments?.[i]?.id,
        title: getShiftById(staffAssignments?.[i]?.shiftId)?.name,
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
          getAssigmentById(staffAssignments?.[i]?.id)?.isUpdated
            ? "highlight"
            : ""
        } ${!isValidDate ? "invalid-date" : ""}`,
      };
      works.push(work);
    }

    const offDays = schedule?.staffs?.find(
      (staff) => staff.id === selectedStaffId
    )?.offDays;
    const dates = getDatesBetween(
      dayjs(schedule.scheduleStartDate).format("DD.MM.YYYY"),
      dayjs(schedule.scheduleEndDate).format("DD.MM.YYYY")
    );
    let highlightedDates: string[] = [];

    dates.forEach((date) => {
      const transformedDate = dayjs(date, "DD-MM-YYYY").format("DD.MM.YYYY");
      if (offDays?.includes(transformedDate)) highlightedDates.push(date);
    });

    Promise.resolve().then(() => {
      setHighlightedDates(highlightedDates);
      setEvents(works);

      if (calendarRef.current) {
        calendarRef.current.getApi().removeAllEvents();
        calendarRef.current.getApi().addEventSource(works);
      }
    });
  };

  useEffect(() => {
    if (schedule && Object.keys(schedule).length > 0) {
      if (!selectedStaffId) {
        setSelectedStaffId(schedule?.staffs?.[0]?.id);
      }

      if (schedule?.assignments && schedule.assignments.length > 0) {
        const sortedAssignments = [...schedule.assignments].sort(
          (a, b) =>
            dayjs(a.shiftStart).valueOf() - dayjs(b.shiftStart).valueOf()
        );

        if (sortedAssignments.length > 0) {
          const firstEventDate = dayjs(sortedAssignments[0].shiftStart)
            .startOf("month")
            .toDate();
          setInitialDate(firstEventDate);

          if (calendarRef.current) {
            calendarRef.current.getApi().gotoDate(firstEventDate);
          }
        }
      }
    }
  }, [schedule]);

  useEffect(() => {
    if (selectedStaffId) {
      generateStaffBasedCalendar();
    }
  }, [selectedStaffId]);

  const RenderEventContent = ({ eventInfo }: any) => {
    return (
      <div className="event-content">
        <p>{eventInfo.event.title}</p>
        {eventInfo.event.extendedProps.isUpdated && <span>Güncellendi</span>}
      </div>
    );
  };

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const eventData = schedule?.assignments?.find(
      (assignment) => assignment.id === eventId
    );

    if (eventData) {
      const staffData = getStaffById(eventData.staffId);
      const shiftData = getShiftById(eventData.shiftId);

      setSelectedEvent({
        id: eventData.id,
        staffName: staffData?.name || "",
        shiftName: shiftData?.name || "",
        date: dayjs(eventData.shiftStart).format("DD.MM.YYYY"),
        startTime: dayjs(eventData.shiftStart).format("HH:mm"),
        endTime: dayjs(eventData.shiftEnd).format("HH:mm"),
        isUpdated: eventData.isUpdated,
      });

      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const checkPairsForStaff = (
    currentStaff: any,
    allStaffs: any[],
    year: number,
    month: number,
    day: number
  ) => {
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

  return (
    <div className="calendar-section">
      <div className="calendar-wrapper">
        <div className="staff-list">
          {schedule?.staffs?.map((staff: any, index: number) => (
            <div
              key={staff.id}
              onClick={() => {
                Promise.resolve().then(() => {
                  setSelectedStaffId(staff.id);
                });
              }}
              className={`staff ${
                staff.id === selectedStaffId ? "active" : ""
              }`}
              style={{
                borderColor:
                  staff.id === selectedStaffId
                    ? staffColors[index % staffColors.length]
                    : undefined,
                backgroundColor:
                  staff.id === selectedStaffId
                    ? `${staffColors[index % staffColors.length]}10`
                    : undefined,
              }}
            >
              <div
                className="staff-avatar"
                style={{
                  backgroundColor: staffColors[index % staffColors.length],
                }}
              >
                {staff.name.charAt(0).toUpperCase()}
              </div>
              <span
                className="staff-name"
                style={{
                  color:
                    staff.id === selectedStaffId
                      ? staffColors[index % staffColors.length]
                      : undefined,
                }}
              >
                {staff.name}
              </span>
              {staff.id === selectedStaffId && (
                <div
                  className="active-indicator"
                  style={{
                    backgroundColor: staffColors[index % staffColors.length],
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <FullCalendar
          ref={calendarRef}
          locale={auth.language}
          plugins={getPlugins()}
          contentHeight={400}
          handleWindowResize={true}
          selectable={true}
          editable={true}
          eventOverlap={true}
          eventDurationEditable={false}
          initialView="dayGridMonth"
          initialDate={initialDate || new Date()}
          events={events}
          firstDay={1}
          dayMaxEventRows={4}
          fixedWeekCount={true}
          showNonCurrentDates={true}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventContent={(eventInfo: any) => (
            <RenderEventContent eventInfo={eventInfo} />
          )}
          datesSet={(info: any) => {
            Promise.resolve().then(() => {
              const prevButton = document.querySelector(
                ".fc-prev-button"
              ) as HTMLButtonElement;
              const nextButton = document.querySelector(
                ".fc-next-button"
              ) as HTMLButtonElement;

              if (
                calendarRef?.current?.getApi().getDate() &&
                !dayjs(schedule?.scheduleStartDate).isSame(
                  calendarRef?.current?.getApi().getDate()
                )
              ) {
                setInitialDate(calendarRef?.current?.getApi().getDate());
              }

              if (!prevButton || !nextButton || !schedule) return;

              const startDiff = dayjs(info.start)
                .utc()
                .diff(
                  dayjs(schedule.scheduleStartDate).subtract(1, "day").utc(),
                  "days"
                );
              const endDiff = dayjs(dayjs(schedule.scheduleEndDate)).diff(
                info.end,
                "days"
              );
              if (startDiff < 0 && startDiff > -35) prevButton.disabled = true;
              else prevButton.disabled = false;

              if (endDiff < 0 && endDiff > -32) nextButton.disabled = true;
              else nextButton.disabled = false;
            });
          }}
          dayCellContent={({ date }) => {
            const currentDate = dayjs(date);
            const currentDay = date.getDate();
            const currentMonth = date.getMonth() + 1;
            const currentYear = date.getFullYear();

            const found = validDates().includes(
              currentDate.format("YYYY-MM-DD")
            );
            const isHighlighted = highlightedDates.includes(
              currentDate.format("DD-MM-YYYY")
            );

            const currentStaff = schedule?.staffs?.find(
              (staff) => staff.id === selectedStaffId
            );
            let pairInfo = null;

            if (currentStaff && schedule?.staffs) {
              const pairResult = checkPairsForStaff(
                currentStaff,
                schedule.staffs,
                currentYear,
                currentMonth,
                currentDay
              );

              if (pairResult.isPaired) {
                const pairedStaffIndex = schedule.staffs.findIndex(
                  (staff) =>
                    staffColors[
                      schedule.staffs.findIndex((s) => s.id === staff.id) %
                        staffColors.length
                    ] === pairResult.color
                );

                if (pairedStaffIndex !== -1) {
                  const pairedStaff = schedule.staffs[pairedStaffIndex];
                  pairInfo = {
                    color: pairResult.color,
                    initial: pairedStaff?.name?.charAt(0)?.toUpperCase() || "",
                  };
                }
              }
            }

            return (
              <div
                className={`calendar-day-cell ${
                  found ? "" : "date-range-disabled"
                } ${isHighlighted ? "highlighted-date-orange" : ""} ${
                  pairInfo ? "has-pair" : ""
                }`}
              >
                <div>{currentDay}</div>
                {pairInfo && (
                  <div className="pair-indicator">
                    <div
                      className="pair-line"
                      style={{ backgroundColor: pairInfo.color }}
                    />
                    <div
                      className="pair-initial"
                      style={{ backgroundColor: pairInfo.color }}
                    >
                      {pairInfo.initial}
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
      {isModalOpen && selectedEvent && (
        <div className="event-modal-overlay" onClick={closeModal}>
          <div
            className="event-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="event-modal-header">
              <h3>Etkinlik Detayları</h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="event-modal-body">
              <div className="event-detail">
                <span className="detail-label">Personel:</span>
                <span className="detail-value">{selectedEvent.staffName}</span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Vardiya:</span>
                <span className="detail-value">{selectedEvent.shiftName}</span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Tarih:</span>
                <span className="detail-value">{selectedEvent.date}</span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Başlangıç Saati:</span>
                <span className="detail-value">{selectedEvent.startTime}</span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Bitiş Saati:</span>
                <span className="detail-value">{selectedEvent.endTime}</span>
              </div>
              {selectedEvent.isUpdated && (
                <div className="event-updated-badge">Güncellendi</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarContainer;
