/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action } from "redux-actions";

import { handleActions } from "redux-actions";

import types from "./types";

import type { ErrorBE } from "../../utils/types";
import type { ScheduleInstance } from "../../models/schedule";

export interface ScheduleState {
  errors: ErrorBE;
  loading: boolean;
  schedule: ScheduleInstance;
}

const initialState: ScheduleState = {
  loading: false,
  errors: {},
  schedule: {} as ScheduleInstance,
};

const scheduleReducer: any = {
  [types.FETCH_SCHEDULE_SUCCESS]: (
    state: ScheduleState,
    { payload }: Action<typeof state.schedule>
  ): ScheduleState => ({
    ...state,
    loading: false,
    errors: {},
    schedule: payload,
  }),

  [types.FETCH_SCHEDULE_FAILED]: (
    state: ScheduleState,
    { payload }: Action<typeof state.errors>
  ): ScheduleState => ({
    ...state,
    loading: false,
    errors: payload,
  }),

  [types.UPDATE_ASSIGNMENT]: (
    state: ScheduleState,
    { payload }: Action<any>
  ): ScheduleState => {
    const updatedSchedule = { ...state.schedule };

    if (!updatedSchedule.assignments) {
      updatedSchedule.assignments = [];
      return {
        ...state,
        schedule: updatedSchedule,
      };
    }

    const assignmentIndex = updatedSchedule.assignments.findIndex(
      (assignment) => assignment.id === payload.id
    );

    if (assignmentIndex === -1) {
      return state;
    }

    const oldAssignment = updatedSchedule.assignments[assignmentIndex];

    const updatedAssignment = {
      ...oldAssignment,
      shiftStart: payload.shiftStart,
      ...(payload.staffId && { staffId: payload.staffId }),
      isUpdated: true,
    };

    if (payload.shiftStart) {
      const oldShiftEndTime = oldAssignment.shiftEnd.split("T")[1];
      updatedAssignment.shiftEnd = `${
        payload.shiftStart.split("T")[0]
      }T${oldShiftEndTime}`;
    }

    updatedSchedule.assignments[assignmentIndex] = updatedAssignment;

    return {
      ...state,
      schedule: updatedSchedule,
    };
  },
};

export default handleActions(scheduleReducer, initialState) as any;
