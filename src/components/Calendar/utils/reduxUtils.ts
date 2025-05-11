import dayjs from "dayjs";
import type { AnyAction } from "redux";
import { updateAssignment } from "../../../store/schedule/actions";
import { useAppDispatch } from "../../../store/hooks";


export const handleEventDrop = (
  eventDropInfo: any,
  schedule: any, 
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  eventDropInfo.jsEvent?.preventDefault();
  
  const eventId = eventDropInfo.event.id;
  
  const newDate = dayjs(eventDropInfo.event.start).format("YYYY-MM-DD");
  
  const assignment = schedule?.assignments?.find((assign: any) => assign.id === eventId);
  
  if (assignment) {
    const originalTime = dayjs(assignment.shiftStart).format("HH:mm:ss");
    const newShiftStart = `${newDate}T${originalTime}`;
    
    dispatch(updateAssignment({
      id: eventId,
      shiftStart: newShiftStart
    }) as AnyAction);
  }
}; 