import { createAction } from 'redux-actions';

import types from './types';

export const fetchSchedule = createAction(types.FETCH_SCHEDULE);
export const fetchScheduleSuccess = createAction(types.FETCH_SCHEDULE_SUCCESS);
export const fetchScheduleFailed = createAction(types.FETCH_SCHEDULE_FAILED);
