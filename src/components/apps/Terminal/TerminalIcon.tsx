import React from "react";

const TerminalIcon: React.FC = () => {
  return (
    <div className="terminal-icon">
      <div className="icon-screen">
        <div className="icon-scanlines"></div>
        <div className="icon-cursor"></div>
      </div>
      <div className="icon-text">$</div>
    </div>
  );
};

export default TerminalIcon;
