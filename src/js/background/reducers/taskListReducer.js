import { PATCH_TASKS } from "../../shared/actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case PATCH_TASKS:
      return action.payload;
    default:
      return state;
  }
};
