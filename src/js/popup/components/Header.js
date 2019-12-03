import React from "react";
import { connect } from "react-redux";
import Settings from "./Settings";
import Timer from "./Timer";

const Header = ({ currentTask }) => {
  return (
    <div className={`header ${currentTask ? currentTask.type : ""}`}>
      <Settings />
      <Timer />
    </div>
  );
};

const mapStateToProps = ({ currentTask }) => {
  return {
    currentTask
  };
};

export default connect(mapStateToProps)(Header);
