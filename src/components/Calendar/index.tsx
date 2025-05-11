/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

import type { EventInput } from "@fullcalendar/core/index.js";
import type { EventDetails } from "./types";
import type { CalendarContainerProps } from "./types";

import "../profileCalendar.scss";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";

import StaffList from "./components/StaffList";
import EventDetailsModal from "./components/EventDetailsModal";
import CalendarView from "./components/CalendarView";

import { getDateRange, getDatesBetween } from "./utils/dateUtils";
import { findShiftById, findStaffById, generateStaffEvents } from "./utils/calendarUtils";
import { handleEventDrop } from "./utils/reduxUtils";

import { staffColors } from "../../constants/staffColors";
import { useAppDispatch } from "../../store/hooks";

const CalendarContainer = ({ schedule, auth }: CalendarContainerProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const dispatch = useAppDispatch();

  const [events, setEvents] = useState<EventInput[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [validDatesList, setValidDatesList] = useState<string[]>([]);

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
  };

  const processEventDrop = (eventDropInfo: any) => {
    handleEventDrop(eventDropInfo, schedule, dispatch);
  };

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const eventData = schedule?.assignments?.find(
      (assignment) => assignment.id === eventId
    );

    if (eventData) {
      const staffData = findStaffById(schedule?.staffs, eventData.staffId);
      const shiftData = findShiftById(schedule?.shifts, eventData.shiftId);

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

  const generateStaffCalendarData = () => {
    if (!schedule || !selectedStaffId) return;
    
    const staffEvents = generateStaffEvents(selectedStaffId, schedule, staffColors);
    setEvents(staffEvents);

    const offDays = schedule?.staffs?.find(
      (staff) => staff.id === selectedStaffId
    )?.offDays;

    const dates = getDatesBetween(
      dayjs(schedule.scheduleStartDate).format("DD.MM.YYYY"),
      dayjs(schedule.scheduleEndDate).format("DD.MM.YYYY")
    );

    let highlighted: string[] = [];
    dates.forEach((date) => {
      const transformedDate = dayjs(date, "DD-MM-YYYY").format("DD.MM.YYYY");
      if (offDays?.includes(transformedDate)) highlighted.push(date);
    });

    setHighlightedDates(highlighted);
  };

  useEffect(() => {
    if (schedule && Object.keys(schedule).length > 0) {
      const dates = getDateRange(schedule.scheduleStartDate, schedule.scheduleEndDate);
      setValidDatesList(dates);

      if (!selectedStaffId && schedule?.staffs?.length > 0) {
        setSelectedStaffId(schedule.staffs[0].id);
      }

      if (schedule?.assignments && schedule.assignments.length > 0) {
        const sortedAssignments = [...schedule.assignments].sort(
          (a, b) => dayjs(a.shiftStart).valueOf() - dayjs(b.shiftStart).valueOf()
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
      generateStaffCalendarData();
    }
  }, [selectedStaffId, schedule]);

  return (
    <div className="calendar-section">
      <div className="calendar-wrapper">
        <StaffList
          staffs={schedule?.staffs || []}
          selectedStaffId={selectedStaffId}
          onStaffSelect={handleStaffSelect}
          staffColors={staffColors}
        />

        <CalendarView
          events={events}
          highlightedDates={highlightedDates}
          validDates={validDatesList}
          initialDate={initialDate}
          selectedStaffId={selectedStaffId}
          language={auth.language}
          calendarRef={calendarRef}
          schedule={schedule}
          onEventClick={handleEventClick}
          onEventDrop={processEventDrop}
          staffs={schedule?.staffs || []}
          staffColors={staffColors}
        />
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default CalendarContainer;
