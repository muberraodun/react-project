import React from "react";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarViewProps } from "../types";
import { checkPairsForStaff } from "../utils/calendarUtils";

const RenderEventContent = ({ eventInfo }: any) => {
  return (
    <div className="event-content">
      <p>{eventInfo.event.title}</p>
      {eventInfo.event.extendedProps.isUpdated && (
        <span>Güncellendi</span>
      )}
    </div>
  );
};

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  highlightedDates,
  validDates,
  initialDate,
  selectedStaffId,
  language,
  calendarRef,
  schedule,
  onEventClick,
  onEventDrop,
  staffColors,
}) => {
  
  const getPlugins = () => {
    const plugins = [dayGridPlugin];
    plugins.push(interactionPlugin);
    return plugins;
  };

  return (
    <FullCalendar
      ref={calendarRef}
      locale={language}
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
      eventClick={onEventClick}
      eventDrop={onEventDrop}
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
            if (calendarRef?.current?.getApi().getDate()) {
            }
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

        const found = validDates.includes(currentDate.format("YYYY-MM-DD"));
        const isHighlighted = highlightedDates.includes(currentDate.format("DD-MM-YYYY"));

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
            currentDay,
            staffColors
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
            className={`calendar-day-cell ${found ? "" : "date-range-disabled"} ${
              isHighlighted ? "highlighted-date-orange" : ""
            } ${pairInfo ? "has-pair" : ""}`}
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
  );
};

export default CalendarView; 