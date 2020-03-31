import React, { useState } from 'react';
import ProcessTable from './components/process-table'
import ProcessDialog from './components/process-dialog'
import SchedulingSection from './components/scheduling-section'
import './App.css';

const defaultProcesses = [
  { id: "A", arrivalTime: 0, serviceTime: 7, priority: 2, color: "#4285f4" },
  { id: "B", arrivalTime: 3, serviceTime: 3, priority: 1, color: "#db4437" },
  { id: "C", arrivalTime: 4, serviceTime: 2, priority: 3, color: "#f4b400" },
  { id: "D", arrivalTime: 6, serviceTime: 5, priority: 2, color: "#0f9d58" },
  { id: "E", arrivalTime: 8, serviceTime: 2, priority: 3, color: "#ab47bc" }
];

function App() {
  const [processes, setProcesses] = useState(defaultProcesses);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const updateProcess = (data) => {
    const { oid, ...process } = data;
    setProcesses((currentProcesses) => {
      return currentProcesses.map(p => {
        return p.id === oid ? process : p;
      });
    });
    setSelectedProcess(null);
  };

  return (
    <div className="App">
      <div className="App-section">
        <h2>Processes:</h2>
        <ProcessTable processes={processes} onClick={setSelectedProcess} />
      </div>

      <div className="App-section">
        <h2>Simulations</h2>
        <SchedulingSection headline="First Come First Served (FCFS)" processes={processes} type="fcfs" />
        <SchedulingSection headline="Shortest Process Next (SPN)" processes={processes} type="spn" />
        <SchedulingSection headline="Shortest Remaining Time Next (SRT)" processes={processes} type="srt" />
        <SchedulingSection headline="Round Robin (Quantum = 1)" processes={processes} type="rr1" />
        <SchedulingSection headline="Round Robin (Quantum = 4)" processes={processes} type="rr4" />
        <SchedulingSection headline="Highest Priority First (with preemption)" processes={processes} type="hpwp" />
        <SchedulingSection headline="Highest Priority First (without preemption)" processes={processes} type="hpnp" />
      </div>

      <div className="footer">
        <a target="_blank" href="https://khadimfall.com">Khadim Fall</a>
        <a target="_blank" href="https://github.com/mono424/scheduling_test_app">GitHub</a>
      </div>

      {selectedProcess && <ProcessDialog process={selectedProcess} onSave={updateProcess} onCancel={() => setSelectedProcess(null)} />}
    </div>
  );
}

export default App;
