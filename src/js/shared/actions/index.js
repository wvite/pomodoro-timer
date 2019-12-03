import {
  ADD_TASK_REQUEST,
  PATCH_TASKS_REQUEST,
  SET_CURRENT_TASK_REQUEST,
  DELETE_TASK_REQUEST,
  START_TIMER_REQUEST,
  PAUSE_TIMER_REQUEST,
  SAVE_REQUEST
} from "./types";
import createUniqueID from "../utils/createUniqueID";

export const requestPatchTasks = () => {
  return {
    type: PATCH_TASKS_REQUEST
  };
};

export const requestSetCurrentTask = taskId => {
  return {
    type: SET_CURRENT_TASK_REQUEST,
    payload: taskId
  };
};

export const requestAddTask = tasks => {
  return {
    type: ADD_TASK_REQUEST,
    payload: tasks.map(task => {
      return { ...task, id: createUniqueID() };
    })
  };
};

export const requestDeleteTask = taskId => {
  return {
    type: DELETE_TASK_REQUEST,
    payload: taskId
  };
};

export const requestStartTimer = () => {
  return {
    type: START_TIMER_REQUEST
  };
};

export const requestPauseTimer = remainingTime => {
  return {
    type: PAUSE_TIMER_REQUEST,
    payload: remainingTime
  };
};

export const requestSave = () => {
  return {
    type: SAVE_REQUEST
  };
};
