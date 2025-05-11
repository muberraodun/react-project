import React, { useEffect } from "react";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarViewProps } from "../types";
import { checkPairsForStaff } from "../utils/calendarUtils";

const RenderEventContent = ({ eventInfo }: any) => {
  const isUpdated = eventInfo.event.classNames.includes("highlight");
  
  return (
    <div className="event-content">
      <p>{eventInfo.event.title}</p>
      {isUpdated && (
        <span>Updated</span>
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

  useEffect(() => {
    if (events && events.length > 0 && calendarRef.current) {
      const sortedEvents = [...events].sort((a, b) => {
        const dateA = a.date ? new Date(a.date.toString()) : new Date();
        const dateB = b.date ? new Date(b.date.toString()) : new Date();
        return dateA.getTime() - dateB.getTime();
      });
      
      if (sortedEvents[0]?.date) {
        const firstEventDate = new Date(sortedEvents[0].date.toString());
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(firstEventDate);
      }
    }
  }, [selectedStaffId, events, calendarRef]);

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
      headerToolbar={{
        left: 'title',
        center: '',
        right: 'prev,next today'
      }}
      buttonText={{
        today: 'Today'
      }}
      datesSet={() => {
        setTimeout(() => {
          if (!schedule) return;
          
          const calendarApi = calendarRef?.current?.getApi();
          if (!calendarApi) return;

          const buttons = document.querySelectorAll('.fc-button');
          buttons.forEach((button) => {
            (button as HTMLButtonElement).disabled = false;
          });
        }, 0);
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
                fullName: pairedStaff?.name || ""
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
                  <div className="pair-name-tooltip">
                    {pairInfo.fullName}
                  </div>
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