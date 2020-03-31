export default {
  scheduler: ({
    statMaker,
    convertFromTo,
    uniq,
    getProcessesInTimespan,
    findShortestServiceTime
  }) => processes => {
    const colors = [];
    const res = [];
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Add ArrivalTimes
    processes.forEach(p => {
      colors.push(p.color);
      res.push([p.id, p.arrivalTime, p.arrivalTime]);
    });

    let startTimes = {};
    let terminateTimes = {};
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
      const potentialNextProcessIsShorterThanCurrent =
        currentProcess &&
        potentialNextProcess &&
        potentialNextProcess.serviceTime < timeLeftForProcess;

      // No Running process start next process
      if (!currentProcess && potentialNextProcess) {
        processBatch = processBatch.filter(
          p => p.id !== potentialNextProcess.id
        );
        currentProcess = potentialNextProcess;
        currentProcess._startTime = currentTimeMark;
        currentProcess._endTime = currentTimeMark + currentProcess.serviceTime;
        importantTimes.push(currentProcess._endTime);
        if (startTimes[currentProcess.id] === undefined) {
          startTimes[currentProcess.id] = currentProcess._startTime;
        }
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

        processBatch = processBatch.filter(
          p => p.id !== potentialNextProcess.id
        );
        currentProcess = potentialNextProcess;
        currentProcess._startTime = currentTimeMark;
        currentProcess._endTime = currentTimeMark + currentProcess.serviceTime;
        if (startTimes[currentProcess.id] === undefined) {
          startTimes[currentProcess.id] = currentProcess._startTime;
        }
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
        processBatch = processBatch.filter(
          p => p.id !== potentialNextProcess.id
        );
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
        if (startTimes[currentProcess.id] === undefined) {
          startTimes[currentProcess.id] = currentProcess._startTime;
        }
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

    return {
      scheduledProcesses: convertFromTo(res),
      colors,
      stats: statMaker().quick(processes, res)
    };
  }
};
