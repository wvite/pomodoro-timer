import React, { Component } from "react";
import { connect } from "react-redux";
import convertTime from "../../shared/utils/convertTime";
import {
  requestStartTimer,
  requestPauseTimer,
  requestSetCurrentTask
} from "../../shared/actions";

class Timer extends Component {
  BUTTONS = [
    {
      type: "start",
      name: "start",
      onClick: () => this.props.startTimer()
    },
    {
      type: "stop",
      name: "pause",
      onClick: () => this.props.pauseTimer(this.props.currentTask.remainingTime)
    }
  ];

  digitToName = "zero one two three four five six seven eight nine".split(" ");
  digits = "d1 d2 d3 d4 d5 d6 d7".split(" ");

  componentDidMount() {
    const { taskList, currentTask } = this.props;
    if (
      taskList &&
      taskList.length > 0 &&
      (!currentTask || currentTask.id !== taskList[0].id)
    ) {
      this.props.setCurrentTask(taskList[0].id);
    }
  }

  renderTime(time) {
    return (
      <div className="display">
        <div className="digits">
          {[
            ...("0" + time.minutes).substr(-2, 2),
            ":",
            ...("0" + time.seconds).substr(-2, 2)
          ].map((cur, i) => {
            if (cur === ":") {
              return <div key={i} className="dots"></div>;
            } else {
              return this.renderDigit(cur, i);
            }
          })}
        </div>
      </div>
    );
  }

  renderDigit(num, key) {
    return (
      <div key={key} className={this.digitToName[Number(num)]}>
        {this.digits.map(digit => (
          <span className={digit}></span>
        ))}
      </div>
    );
  }

  renderButtons() {
    return this.BUTTONS.map(({ name, type, onClick }) => (
      <span className="btn" id={`btn-${type}`} key={type} onClick={onClick}>
        {name}
      </span>
    ));
  }

  render() {
    const task = this.props.currentTask;
    return (
      <div className="pomodoro">
        <div className="timer light">
          {this.renderTime(convertTime(task ? task.remainingTime : null))}
        </div>
        <div>{this.renderButtons()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { currentTask: state.currentTask };
};

const mapDispatchToProps = dispatch => {
  return {
    startTimer: () => dispatch(requestStartTimer()),
    pauseTimer: remainingTime => dispatch(requestPauseTimer(remainingTime)),
    setCurrentTask: taskId => dispatch(requestSetCurrentTask(taskId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
