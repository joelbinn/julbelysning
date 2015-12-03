'use strict';

class Scheduler {
  constructor(schedule, setStateFn) {
    this.schedule = schedule;
    this.setStateFn = setStateFn
  }

  run() {
    var s = findFirst(this);
    setTimeout(handleTimeout(0, this), 0);

    function findFirst(self) {
      const now = new Date();
      return self.schedule.filter((r) => {
        if (r.delay !== undefined) {
          return true;
        } else {
          const next = new Date();
          next.setHours(r.hour);
          next.setMinutes(r.minute);
          next.setSeconds(0);
          return next.getTime() >= now.getTime();
        }
      });
    }

    function handleTimeout(state, self) {
      console.log('======================');
      console.log('Setting switch:', state);
      setTimeout(() => self.setStateFn(state), 0);

      if (s.length === 0) s = [].concat(self.schedule);
      console.log('remaining schedule:', s);
      if (s.length === 0) return;

      var nextRecord = s.splice(0, 1)[0];
      console.log('nextRecord:', nextRecord);
      var delay = nextRecord.delay;
      if (delay === undefined) {
        const now = new Date();
        const next = new Date();
        next.setHours(nextRecord.hour);
        next.setMinutes(nextRecord.minute);
        next.setSeconds(0);
        if (next.getTime() <= now.getTime()) {
          const nextTime = next.getTime() + (1000 * 60 * 60 * 24);
          next.setTime(nextTime);
        }
        console.log('next:', next);
        delay = next.getTime() - now.getTime();
      } else {
        self.schedule = self.schedule.filter((r) => r !== nextRecord);
      }
      console.log('delay:', delay);
      setTimeout(() => handleTimeout(nextRecord.state, self), delay);
    }
  }
}

module.exports = Scheduler;
