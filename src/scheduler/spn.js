export default {
  scheduler: ({
    statMaker,
    convertFromTo,
    getProcessesInTimespan,
    findShortestServiceTime
  }) => processes => {
    const res = [];
    const colors = [];
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const processSelector = getProcessesInTimespan(processes);
    let currentTimeMark = processes[0].arrivalTime;
    let processBatch = processSelector(currentTimeMark, currentTimeMark);

    // Add ArrivalTimes
    processes.forEach(p => {
      colors.push(p.color);
      res.push([p.id, p.arrivalTime, p.arrivalTime]);
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
      res.push([nextProcess.id, from, to]);

      // Make new batch
      currentTimeMark = to;
      processBatch.push(...processSelector(from, to));
    }

    return {
      scheduledProcesses: convertFromTo(res),
      colors,
      stats: statMaker().quick(processes, res)
    };
  }
};
