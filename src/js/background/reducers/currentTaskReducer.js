import {
  SET_CURRENT_TASK,
  UPDATE_TIMER,
  START_TIMER,
  PAUSE_TIMER
} from "../../shared/actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_TASK:
      return action.payload;
    case UPDATE_TIMER:
    case START_TIMER:
    case PAUSE_TIMER:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
