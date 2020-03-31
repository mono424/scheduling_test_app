export default {
  scheduler: ({
    statMaker,
    convertFromTo,
    getProcessesInTimespan
  }) => quantum => processes => {
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const res = [];
    processes.forEach(p => {
        res.push([p.id, p.arrivalTime, p.arrivalTime]);
    });

    const processSelector = getProcessesInTimespan(processes);
    let currentTimeMark = processes[0].arrivalTime;
    let processBatch = [];

    let lastTimeMark = currentTimeMark;
    let itemToReAdd = null;
    do {
      let addTimeToMark = 1;
    
      processBatch.push(...processSelector(
        lastTimeMark,
        currentTimeMark
      ).map(p => ({ _timeLeft: p.serviceTime, ...p })));
      if (itemToReAdd) { processBatch.push(itemToReAdd); itemToReAdd = null }

      if (processBatch.length > 0) {
        const currProcess = processBatch.shift();
        if (quantum > currProcess._timeLeft) {
          addTimeToMark = currProcess._timeLeft;
        } else {
          addTimeToMark = quantum;
        }
        res.push([
          currProcess.id,
          currentTimeMark,
          currentTimeMark + addTimeToMark
        ]);

        currProcess._timeLeft -= addTimeToMark;
        if (currProcess._timeLeft > 0) {
            itemToReAdd = currProcess;
        }
      }

      lastTimeMark = currentTimeMark;
      currentTimeMark += addTimeToMark;
    } while (processBatch.length > 0 || itemToReAdd);

    return {
      scheduledProcesses: convertFromTo(res),
      colors: processes.map(p => p.color),
      stats: statMaker().quick(processes, res)
    };
  }
};
