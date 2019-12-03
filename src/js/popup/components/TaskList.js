import React, { Component } from "react";
import { connect } from "react-redux";
import TaskListItem from "./TaskListItem";

class TaskList extends Component {
  renderList(list) {
    return list.slice(1).map(task => {
      return <TaskListItem key={task.id} task={task} />;
    });
  }

  render() {
    return (
      <div className="task-list">{this.renderList(this.props.taskList)}</div>
    );
  }
}

const mapStateToProps = ({ taskList }) => {
  return {
    taskList
  };
};

export default connect(mapStateToProps)(TaskList);
