import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "webext-redux";
import "@babel/polyfill";

import App from "./components/App";
import "./scss/style.scss";

const store = new Store({ portName: "POMODOROTIMER" });

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector("#root")
  );
});
