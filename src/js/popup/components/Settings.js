import React, { Component } from "react";
import { connect } from "react-redux";
import { requestAddTask, requestDeleteTask } from "../../shared/actions";

class Settings extends Component {
  SETTING = [
    {
      type: "close",
      src: "../../../images/icons/times-solid.svg",
      onClick: () => {
        if (this.props.currentTask)
          this.props.deleteTask(this.props.currentTask.id);
      }
    },
    {
      type: "add",
      src: "../../../images/icons/plus-solid.svg",
      onClick: () => {
        this.props.addTask([
          {
            type: "work",
            name: "work",
            time: 1500000
          },
          {
            type: "break",
            name: "break",
            time: 300000
          }
        ]);
      }
    }
  ];

  renderIcons() {
    return this.SETTING.map(({ type, src, onClick }) => (
      <img
        className={`setting ${type}`}
        key={type}
        src={src}
        onClick={onClick}
      />
    ));
  }

  render() {
    return <div className="settings">{this.renderIcons()}</div>;
  }
}

const mapStateToProps = ({ taskList, currentTask }) => {
  return {
    taskList,
    currentTask
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTask: tasks => dispatch(requestAddTask(tasks)),
    deleteTask: taskId => dispatch(requestDeleteTask(taskId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
