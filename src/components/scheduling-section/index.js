import React from "react";
import Chart from "react-google-charts";
import scheduler from "../../scheduler";
import "./styles.css";

function SchedulingSection({ processes, type, headline }) {
  let selected_scheduler = scheduler[type];
  const { scheduledProcesses, colors, stats } = selected_scheduler(processes);
  return (
    <div className="SchedulingSection box">
      <Chart
        width={"100%"}
        height={"400px"}
        chartType="Timeline"
        loader={<div>Loading Chart ...</div>}
        data={[
          [
            { type: "string", id: "ProcessId" },
            { type: "date", id: "Start" },
            { type: "date", id: "End" }
          ],
          ...(scheduledProcesses || [])
        ]}
        options={{
          colors,
          avoidOverlappingGridLines: true,
        }}
      />
      <div className="SchedulingSection-stats">
      <h2>{headline}</h2>
        <div>Average Turnaround-Time: <b>{stats.averageTurnaroundTime}</b></div>
        <div>Average Response-Time: <b>{stats.averageResponseTime}</b></div>
      </div>
    </div>
  );
}

export default SchedulingSection;
