import React from "react";
import { connect } from "react-redux";
import convertTime from "../../shared/utils/convertTime";
import { requestDeleteTask } from "../../shared/actions";

const TaskListItem = ({ task, deleteTask }) => {
  return (
    <div className={`task ${task.type}`} key={task.id}>
      <span className="task-name">{task.type}</span>
      <span className="task-delete" onClick={() => deleteTask(task.id)}>
        <img className="trash" src="images/icons/times-solid.svg" />
      </span>
      <span className="task-time">{convertTime(task.time).minutes} min</span>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    deleteTask: taskId => dispatch(requestDeleteTask(taskId))
  };
};

export default connect(null, mapDispatchToProps)(TaskListItem);
