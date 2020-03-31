export default {
  scheduler: ({ statMaker, convertFromTo }) => processes => {
    const res = [];
    const colors = [];
    processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    processes.forEach(p => {
      const lastProc = res.length ? res[res.length - 1] : null;
      const lastTerminateTime = lastProc ? lastProc[2] : -1;
      const from =
        p.arrivalTime > lastTerminateTime ? p.arrivalTime : lastTerminateTime;
      const to = from + p.serviceTime;

      colors.push(p.color);
      res.push([p.id, p.arrivalTime, p.arrivalTime]);
      res.push([p.id, from, to]);
    });
  
    return {
      scheduledProcesses: convertFromTo(res),
      colors,
      stats: statMaker().quick(processes, res)
    };
  }
};
