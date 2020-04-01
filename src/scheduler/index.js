import fcfs from "./fcfs";
import spn from "./spn";
import srt from "./srt";
import rr from "./rr";
import hpwp from "./hpwp";
import hpnp from "./hpnp";
const baseTs = new Date(0).getTime();

function statMaker() {
  return {
    get() {
      const stats = {
        totalTurnaroundTime: 0,
        totalResponseTime: 0,
        averageTurnaroundTime: 0,
        averageResponseTime: 0
      };

      this._processes.forEach(p => {
        stats.totalTurnaroundTime += this._calcTotalTurnaroundTime(p);
        stats.totalResponseTime += this._calcTotalResponseTime(p);
      });
  
      stats.averageTurnaroundTime = stats.totalTurnaroundTime / this._processes.length;
      stats.averageResponseTime = stats.totalResponseTime / this._processes.length;
      return stats;
    },
    quick(processes, processTimespanes) {
      this.setProcesses(processes);
      processTimespanes.forEach(([id, start, end]) => this.processTimespan(id, start, end));
      return this.get();
    },
    processTimespan(pid, start, end) {
      if (start >= end) { return; }
      this.processStarted(pid, start);
      this.processTerminated(pid, end);
    },
    processStarted(pid, time) {
      this._processes.find(p => p.id === pid).startTimes.push(time);
    },
    processTerminated(pid, time) {
      this._processes.find(p => p.id === pid).terminateTimes.push(time);
    },
    setProcesses(processes) {
      this._processes = processes.map(p => ({
        id: p.id,
        startTimes: [],
        terminateTimes: [],
        arrivalTime: p.arrivalTime
      }));
    },
    _calcTotalResponseTime(process) {
      return process.startTimes[0] - process.arrivalTime;
    },
    _calcTotalTurnaroundTime(process) {
      return [...process.terminateTimes].pop() - process.arrivalTime;
    },
    _processes: [],
  };
}

function uniq(value, index, self) {
  return self.indexOf(value) === index;
}

const convertFromTo = processes =>
  processes.map(([id, from, to, ...res]) => [
    id,
    new Date(baseTs + from * 1000),
    new Date(baseTs + to * 1000),
    ...res
  ]);

const getProcessesInTimespan = processes => (from, to) =>
  processes.filter(
    p =>
      (p.arrivalTime > from && p.arrivalTime <= to) ||
      (from === to && p.arrivalTime === from)
  );

const findShortestServiceTime = processes => {
  const shortest = [...processes].sort(
    (a, b) => a.serviceTime - b.serviceTime
  )[0];
  return shortest;
};

const utils = {
  statMaker,
  convertFromTo,
  uniq,
  getProcessesInTimespan,
  findShortestServiceTime
};

export default {
  fcfs: fcfs.scheduler(utils),
  spn: spn.scheduler(utils),
  srt: srt.scheduler(utils),
  rr1: rr.scheduler(utils)(1),
  rr4: rr.scheduler(utils)(4),
  hpwp: hpwp.scheduler(utils),
  hpnp: hpnp.scheduler(utils),
};
