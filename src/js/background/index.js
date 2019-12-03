import { createStore, applyMiddleware, compose } from "redux";
import { wrapStore, alias } from "webext-redux";
import reduxThunk from "redux-thunk";
import { createLogger } from "redux-logger";
import reducers from "./reducers";
import aliases from "./aliases";

import "@babel/polyfill";

const logger = createLogger({
  collapsed: true
});

const initialState = {
  currentTask: null,
  taskList: []
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(alias(aliases), reduxThunk, logger))
);

wrapStore(store, {
  portName: "POMODOROTIMER"
});
