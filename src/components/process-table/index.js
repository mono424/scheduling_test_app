import React from "react";
import "./styles.css";

function ProcessTable({processes, onClick}) {
  return (
    <div className="ProcessTable">
      {processes.map(p => {
        return (
          <div onClick={() => onClick(p)} key={p.id} className="ProcessTable-Item box">
            <div className="color" style={{ backgroundColor: p.color }}></div>
            <div><i>Process:</i>{p.id}</div>
            <div><i>ArrivalTime:</i>{p.arrivalTime}</div>
            <div><i>ServiceTime:</i>{p.serviceTime}</div>
            <div><i>Priority:</i>{p.priority}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ProcessTable;
