import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import TaskList from "./TaskList";
import { requestPatchTasks, requestSave } from "../../shared/actions";

class App extends Component {
  componentDidMount() {
    this.props.patchTasks();
  }

  render() {
    return (
      <div className="container">
        <Header />
        <TaskList />
      </div>
    );
  }

  componentWillUnmount() {
    this.props.saveTasks();
  }
}

const mapDispatchToProps = dispatch => {
  return {
    patchTasks: () => dispatch(requestPatchTasks()),
    saveTasks: () => dispatch(requestSave())
  };
};

export default connect(null, mapDispatchToProps)(App);
