import type { EventInput } from "@fullcalendar/core/index.js";
import type { ScheduleInstance } from "../../../models/schedule";
import type { UserInstance } from "../../../models/user";

export interface CalendarContainerProps {
  schedule: ScheduleInstance;
  auth: UserInstance;
}

export interface StaffSelectProps {
  staffs: any[];
  selectedStaffId: string | null;
  onStaffSelect: (staffId: string) => void;
  staffColors: string[];
}

export interface EventDetailsModalProps {
  event: EventDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface EventDetails {
  id: string;
  staffName: string;
  shiftName: string;
  date: string;
  startTime: string;
  endTime: string;
  isUpdated: boolean;
}

export interface PairInfo {
  isPaired: boolean;
  color: string;
  initial?: string;
  fullName?: string;
}

export interface CalendarViewProps {
  events: EventInput[];
  highlightedDates: string[];
  validDates: string[];
  initialDate: Date | null;
  selectedStaffId: string | null;
  language: string;
  calendarRef: React.RefObject<any>;
  schedule: ScheduleInstance;
  onEventClick: (eventInfo: any) => void;
  onEventDrop: (eventDropInfo: any) => void;
  staffs: any[];
  staffColors: string[];
} 