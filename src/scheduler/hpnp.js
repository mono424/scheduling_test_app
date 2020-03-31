export default {
  scheduler: ({
    statMaker,
    convertFromTo,
    getProcessesInTimespan
  }) => processes => {
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const res = [];
    processes.forEach(p => {
        res.push([p.id, p.arrivalTime, p.arrivalTime]);
    });

    const processSelector = getProcessesInTimespan(processes);
    let currentTimeMark = processes[0].arrivalTime;
    let lastArrivalTimw = processes[processes.length - 1].arrivalTime;
    let processBatch = [];

    let lastTimeMark = currentTimeMark;
    do {
      let addTimeToMark = 1;
    
      processBatch.push(...processSelector(
        lastTimeMark,
        currentTimeMark
      ).map(p => ({ _timeLeft: p.serviceTime, ...p, _lastStart: -1 })));
      processBatch.sort((a, b) => ((b.priority - a.priority) || (b._lastStart - a._lastStart)))

      if (processBatch.length > 0) {
        const currProcess = processBatch.shift();
        addTimeToMark = currProcess.serviceTime;

        res.push([
          currProcess.id,
          currentTimeMark,
          currentTimeMark + addTimeToMark
        ]);
      }

      lastTimeMark = currentTimeMark;
      currentTimeMark += addTimeToMark;
    } while (processBatch.length > 0 || currentTimeMark <= lastArrivalTimw);

    return {
      scheduledProcesses: convertFromTo(res),
      colors: processes.map(p => p.color),
      stats: statMaker().quick(processes, res)
    };
  }
};
