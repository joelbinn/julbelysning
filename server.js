console.log('Starting...');

const http = require('http');
var session;

const schedule = [{
  delay: 2000,
  state: 0
}, {
  delay: 2000,
  state: 1
}, {
  delay: 2000,
  state: 0
}, {
  delay: 2000,
  state: 1
},{
  hour: 0,
  minute: 5,
  state: 0
},{
  hour: 6,
  minute: 30,
  state: 1
}, {
  hour: 9,
  minute: 00,
  state: 0
}, {
  hour: 15,
  minute: 30,
  state: 1
}, {
  hour: 23,
  minute: 30,
  state: 0
}]

login();

runSchedule(schedule);

function runSchedule() {
  var s = findFirst();
  setTimeout(handleTimeout(0), 0);

  function findFirst() {
    const now = new Date();
    return schedule.filter((r)=>{
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

  function handleTimeout(state) {
    console.log('======================');
    console.log('Setting switch:', state);
    setTimeout(() => setSwitch(state), 0);

    if (s.length === 0) s = [].concat(schedule);
    console.log('remaining schedule:', s);

    var nextRecord = s.splice(0, 1)[0];
    console.log('nextRecord:', nextRecord);
    if (nextRecord.done) {
      // Jump to next
      console.log('skip record:', nextRecord);
      setTimeout(() => handleTimeout(state), 0);
    } else {
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
        nextRecord.done = true;
      }
      console.log('delay:', delay);
      setTimeout(() => handleTimeout(nextRecord.state), delay);
    }
  }
}


function postObject(host, port, path, obj, callback) {
  var options = {
    hostname: host,
    port: port,
    path: path,
    method: 'POST',
    headers: {
      Cookie: 'ZWAYSession=' + session
    }
  }

  if (obj) {
    options.headers['Content-Type'] = 'application/json';
    options.headers['Content-Length'] = obj ? JSON.stringify(obj).length : 0;
  }

  console.log('options:', options);
  const req = http.request(
    options,
    callback
  );

  if (obj) req.write(JSON.stringify(obj));
  req.end();
  console.log('http://' + host + ':' + port + path);
}

function login() {
  postObject(
    'localhost',
    8083,
    '/ZAutomation/api/v1/login', {
      login: 'admin',
      password: 'hju890AZF'
    }, (resp) => {
      console.log('STATUS:', resp.statusCode, 'Set-Cookie:', resp.headers['set-cookie']);
      const cookies = resp.headers['set-cookie'];
      if (cookies) {
        const cookieMap = cookies.reduce(
          (all, c) => {
            const eq = c.indexOf('=');
            all[c.substr(0, eq)] = c.substr(eq + 1);
            return all;
          }, {});
        console.log('session:', cookieMap['ZWAYSession']);
        session = cookieMap['ZWAYSession'];
      }
    }
  );
}

function setSwitch(state) {
  postObject(
    'localhost',
    8083,
    '/ZWaveAPI/Run/devices[2].instances[0].SwitchBinary.Set(' + state + ')',
    undefined, (resp) => console.log('STATUS: ' + resp.statusCode)
  );
}
