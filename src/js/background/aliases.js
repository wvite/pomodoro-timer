import {
  START_TIMER,
  PAUSE_TIMER,
  UPDATE_TIMER,
  PAUSE_TIMER_REQUEST,
  PATCH_TASKS,
  SET_CURRENT_TASK,
  REFRESH_REQUEST,
  SET_CURRENT_TASK_REQUEST,
  DELETE_TASK_REQUEST
} from "../shared/actions/types";
import chromeNotify from "../shared/apis/chromeNotify";

const refreshRequested = () => (dispatch, getState) => {
  const { taskList, currentTask } = getState();
  if (taskList.length === 0) {
    dispatch({
      type: SET_CURRENT_TASK_REQUEST,
      payload: null
    });
  } else if (!currentTask || currentTask.id !== taskList[0].id) {
    dispatch({
      type: SET_CURRENT_TASK_REQUEST,
      payload: taskList.length > 0 ? taskList[0].id : null
    });
  }
};

const patchTasksRequested = () => (dispatch, getState) => {
  chrome.storage.local.get(["pomodoro_timer"], result => {
    if (result.pomodoro_timer) {
      dispatch({
        type: PATCH_TASKS,
        payload: result.pomodoro_timer
      });
      dispatch({
        type: REFRESH_REQUEST
      });
    }
  });
};

const setCurrentTaskRequested = action => (dispatch, getState) => {
  const task = getState().taskList.find(el => el.id === action.payload);
  const curTask = task
    ? {
        id: task.id,
        duration: task.time,
        remainingTime: task.time,
        type: task.type,
        startedAt: null,
        alarm: null
      }
    : null;
  dispatch({
    type: SET_CURRENT_TASK,
    payload: curTask
  });
};

const addTaskRequested = action => (dispatch, getState) => {
  const added = [...getState().taskList, ...action.payload];
  chrome.storage.local.set(
    {
      pomodoro_timer: added
    },
    () => {
      dispatch({
        type: PATCH_TASKS,
        payload: added
      });
      dispatch({
        type: REFRESH_REQUEST
      });
    }
  );
};

const deleteTaskRequested = action => (dispatch, getState) => {
  const { taskList } = getState();
  if (taskList && taskList.length > 0) {
    const filtered = taskList.filter(el => el.id !== action.payload);
    chrome.storage.local.set(
      {
        pomodoro_timer: filtered
      },
      () => {
        dispatch({
          type: PATCH_TASKS,
          payload: filtered
        });
        dispatch({
          type: REFRESH_REQUEST
        });
      }
    );
  }
};
const startTimerRequested = () => (dispatch, getState) => {
  const { currentTask } = getState();
  const startedAt = Date.now();
  if (currentTask && !currentTask.alarm) {
    const alarm = setTimeout(() => dispatch(updateTimer()), 800);
    chromeNotify(`start_${currentTask.type}`);
    dispatch({
      type: START_TIMER,
      payload: { ...currentTask, alarm, startedAt }
    });
  }
};

const updateTimer = () => (dispatch, getState) => {
  const now = Date.now();
  const { startedAt, duration, type } = getState().currentTask;
  const remainingTime = duration + startedAt - now;
  if (remainingTime > 0) {
    const alarm = setTimeout(() => dispatch(updateTimer()), 1000);
    dispatch({
      type: UPDATE_TIMER,
      payload: {
        alarm,
        remainingTime
      }
    });
  } else {
    chromeNotify(`done_${type}`);
    dispatch({
      type: PAUSE_TIMER_REQUEST,
      payload: remainingTime
    });
  }
};

const pauseTimerRequested = action => (dispatch, getState) => {
  const { currentTask, taskList } = getState();
  if (currentTask && currentTask.alarm) {
    clearTimeout(currentTask.alarm);
    if (action.payload > 0) {
      dispatch({
        type: PAUSE_TIMER,
        payload: {
          alarm: null,
          duration: action.payload
        }
      });
    } else {
      dispatch({
        type: DELETE_TASK_REQUEST,
        payload: taskList[0].id
      });
    }
  }
};

const saveRequested = () => (dispatch, getState) => {
  chrome.storage.local.set({
    pomodoro_timer: getState().taskList
  });
};

export default {
  REFRESH_REQUEST: refreshRequested,
  PATCH_TASKS_REQUEST: patchTasksRequested,
  SET_CURRENT_TASK_REQUEST: setCurrentTaskRequested,
  ADD_TASK_REQUEST: addTaskRequested,
  DELETE_TASK_REQUEST: deleteTaskRequested,
  START_TIMER_REQUEST: startTimerRequested,
  PAUSE_TIMER_REQUEST: pauseTimerRequested,
  SAVE_REQUEST: saveRequested
};
