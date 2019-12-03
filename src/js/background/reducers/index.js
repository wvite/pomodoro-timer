import { combineReducers } from "redux";
import currentTaskReducer from "./currentTaskReducer";
import taskListReducer from "./taskListReducer";

export default combineReducers({
  currentTask: currentTaskReducer,
  taskList: taskListReducer
});
