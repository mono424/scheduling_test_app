import React, { useState } from "react";
import InputColor from "react-input-color";
import "./styles.css";

function ProcessDialog({ process, onSave, onCancel }) {
  const [color, setColor] = useState({});
  const [processId, setProcessId] = useState(process.id);
  const [oProcessId] = useState(process.id);
  const [arrivalTime, setArrivalTime] = useState(process.arrivalTime);
  const [serviceTime, setServiceTime] = useState(process.serviceTime);
  const [priority, setPriority] = useState(process.priority);

  const save = () => {
    onSave({
      oid: oProcessId,
      id: processId,
      color: color.hex,
      arrivalTime: parseInt(arrivalTime),
      serviceTime: parseInt(serviceTime),
      priority: parseInt(priority)
    });
  };

  return (
    <div className="ProcessDialog" onClick={onCancel}>
      <div className="ProcessDialog-dialog" onClick={e => e.stopPropagation()}>
        <div className="ProcessDialog-input">
          <label>Color</label>
          <span>
            <InputColor
              initialHexColor={process.color}
              onChange={setColor}
              placement="right"
            />
          </span>
        </div>
        <div className="ProcessDialog-input">
          <label>Process</label>
          <input
            value={processId}
            onChange={e => setProcessId(e.target.value)}
          ></input>
        </div>
        <div className="ProcessDialog-input">
          <label>ArrivalTime</label>
          <input
            value={arrivalTime}
            onChange={e => setArrivalTime(e.target.value)}
          ></input>
        </div>
        <div className="ProcessDialog-input">
          <label>ServiceTime</label>
          <input
            value={serviceTime}
            onChange={e => setServiceTime(e.target.value)}
          ></input>
        </div>
        <div className="ProcessDialog-input">
          <label>Priority</label>
          <input
            value={priority}
            onChange={e => setPriority(e.target.value)}
          ></input>
        </div>

        <button className="ProcessDialog-saveBtn" onClick={save}>Save</button>
      </div>
    </div>
  );
}

export default ProcessDialog;
