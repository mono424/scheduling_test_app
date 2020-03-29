import chroma from "chroma-js";
const baseTs = new Date(0).getTime();

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

export default {
  fcfs(processes) {
    const stats = {
      totalTurnaroundTime: 0,
      totalResponseTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0
    };
    const res = [];
    const colors = [];
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    processes.forEach(p => {
      const lastProc = res.length ? res[res.length - 1] : null;
      const lastTerminateTime = lastProc ? lastProc[2] : -1;
      const from =
        p.arrivalTime > lastTerminateTime ? p.arrivalTime : lastTerminateTime;
      const to = from + p.serviceTime;
      const responseTime = to - p.arrivalTime;

      stats.totalTurnaroundTime += to - from;
      stats.totalResponseTime += responseTime;
      colors.push(p.color);
      res.push([p.id, p.arrivalTime, p.arrivalTime]);
      res.push([p.id, from, to]);
    });

    stats.averageTurnaroundTime = stats.totalTurnaroundTime / processes.length;
    stats.averageResponseTime = stats.totalResponseTime / processes.length;
    return {
      scheduledProcesses: convertFromTo(res),
      colors,
      stats
    };
  },

  spn(processes) {
    const stats = {
      totalTurnaroundTime: 0,
      totalResponseTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0
    };
    const res = [];
    const colors = [];
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const processSelector = getProcessesInTimespan(processes);
    let currentTimeMark = processes[0].arrivalTime;
    let processBatch = processSelector(currentTimeMark, currentTimeMark);

    // Add ArrivalTimes
    processes.forEach(p => {
      colors.push(p.color);
      res.push([
        p.id,
        p.arrivalTime,
        p.arrivalTime
      ]);
    });


    // Add Processes
    while (processBatch.length) {
      let nextProcess;
      if (processBatch.length === 1) {
        nextProcess = processBatch.pop();
      } else {
        nextProcess = findShortestServiceTime(processBatch);
        processBatch = processBatch.filter(p => p.id !== nextProcess.id);
      }

      // Add shortest process in batch
      const from = currentTimeMark;
      const to = from + nextProcess.serviceTime;
      const responseTime = to - nextProcess.arrivalTime;
      stats.totalTurnaroundTime += to - from;
      stats.totalResponseTime += responseTime;
      res.push([nextProcess.id, from, to]);

      // Make new batch
      currentTimeMark = to;
      processBatch.push(...processSelector(from, to));
    }

    stats.averageTurnaroundTime = stats.totalTurnaroundTime / processes.length;
    stats.averageResponseTime = stats.totalResponseTime / processes.length;

    return {
      scheduledProcesses: convertFromTo(res),
      colors,
      stats
    };
  },

  srt(processes) {
    const colors = [];
    const res = [];
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Add ArrivalTimes
    processes.forEach(p => {
      colors.push(p.color);
      res.push([
        p.id,
        p.arrivalTime,
        p.arrivalTime
      ]);
    });

    let startTimes = {}
    let terminateTimes = {}
    const processSelector = getProcessesInTimespan(processes);
    let importantTimes = processes
      .map(p => p.arrivalTime)
      .filter(uniq)
      .reverse();
    let currentTimeMark = importantTimes.pop();
    let processBatch = [];
    let currentProcess = null;
    while (importantTimes.length || processBatch.length || currentProcess) {
      if (importantTimes.length == 0) {
        importantTimes.push(currentTimeMark + 1);
      }
      // Add new processes if there are any for currentTimeMark
      processBatch.push(...processSelector(currentTimeMark, currentTimeMark));

      // Find next process if there is a shorter one than the current
      const timeLeftForProcess = currentProcess
        ? currentProcess.serviceTime -
          (currentTimeMark - currentProcess._startTime)
        : null;
      const potentialNextProcess = findShortestServiceTime(processBatch);
      const potentialNextProcessIsShorterThanCurrent = currentProcess &&
        potentialNextProcess &&
        potentialNextProcess.serviceTime < timeLeftForProcess;

      // No Running process start next process
      if (!currentProcess && potentialNextProcess) {
        processBatch = processBatch.filter(p => p.id !== potentialNextProcess.id);
        currentProcess = potentialNextProcess;
        currentProcess._startTime = currentTimeMark;
        currentProcess._endTime = currentTimeMark + currentProcess.serviceTime;
        importantTimes.push(currentProcess._endTime);
        if(startTimes[currentProcess.id] === undefined) { startTimes[currentProcess.id] = currentProcess._startTime; }
        importantTimes = importantTimes
          .filter(uniq)
          .sort()
          .reverse();
        currentTimeMark = importantTimes.pop();
        continue;
      }

      // Process is terminated but no new process in line
      if (
        currentProcess &&
        currentProcess._endTime <= currentTimeMark &&
        !potentialNextProcess
      ) {
        res.push([
          currentProcess.id,
          currentProcess._startTime,
          currentProcess._endTime
        ]);
        terminateTimes[currentProcess.id] = currentProcess._endTime;
        currentProcess = null;
        currentTimeMark = importantTimes.pop();
        continue;
      }

      // Process is terminated with new process in line
      if (
        currentProcess &&
        currentProcess._endTime <= currentTimeMark &&
        potentialNextProcess
      ) {
        res.push([
          currentProcess.id,
          currentProcess._startTime,
          currentProcess._endTime
        ]);
        terminateTimes[currentProcess.id] = currentProcess._endTime;
        
        processBatch = processBatch.filter(p => p.id !== potentialNextProcess.id);
        currentProcess = potentialNextProcess;
        currentProcess._startTime = currentTimeMark;
        currentProcess._endTime = currentTimeMark + currentProcess.serviceTime;
        if(startTimes[currentProcess.id] === undefined) { startTimes[currentProcess.id] = currentProcess._startTime; }
        importantTimes.push(currentProcess._endTime);
        importantTimes = importantTimes
          .filter(uniq)
          .sort()
          .reverse();
        currentTimeMark = importantTimes.pop();
        continue;
      }

      // Stop current running process, to start a shorter one
      if (potentialNextProcessIsShorterThanCurrent) {
        processBatch = processBatch.filter(p => p.id !== potentialNextProcess.id);
        res.push([
          currentProcess.id,
          currentProcess._startTime,
          currentTimeMark
        ]);

        // Add rest of current process to process batch
        const timeLeftForProcess =
        currentProcess.serviceTime -
        (currentTimeMark - currentProcess._startTime);
        processBatch.push({
          ...currentProcess,
          _startTime: null,
          _endTime: null,
          serviceTime: timeLeftForProcess
        });

        // Set next process as current running process
        currentProcess = potentialNextProcess;
        currentProcess._startTime = currentTimeMark;
        currentProcess._endTime = currentTimeMark + currentProcess.serviceTime;
        if(startTimes[currentProcess.id] === undefined) { startTimes[currentProcess.id] = currentProcess._startTime; }
        importantTimes.push(currentProcess._endTime);
        importantTimes = importantTimes
          .filter(uniq)
          .sort()
          .reverse();
        currentTimeMark = importantTimes.pop();
        continue;
      }

      // Do nothing go to next timemark
      currentTimeMark = importantTimes.pop();
    }

    const stats = {
      totalTurnaroundTime: 0,
      totalResponseTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0
    };

    processes.forEach(p => {
      stats.totalTurnaroundTime += terminateTimes[p.id] - startTimes[p.id];
      stats.totalResponseTime += terminateTimes[p.id] - p.arrivalTime;
    });

    stats.averageTurnaroundTime = stats.totalTurnaroundTime / processes.length;
    stats.averageResponseTime = stats.totalResponseTime / processes.length;

    return {
      scheduledProcesses: convertFromTo(res),
      colors,
      stats
    };
  }
};
