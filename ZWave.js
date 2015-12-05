'use strict';

const rp = require('request-promise');

class ZWave {
  constructor(host) {
    this.host = 'http://'+host;
  }

  /**
   * Sets the switch state
   * @param state the state {0,1}
   * @returns a promise
   */
  setSwitch(state) {
    return postObject(
        this.host,
        8083,
        '/ZWaveAPI/Run/devices[2].instances[0].SwitchBinary.Set(' + state + ')',
        undefined,
        this.session)
      .then((resp) => console.log('STATUS: ' + resp.statusCode));
  }

  login() {
    const host = this.host;
    return postObject(
        this.host,
        8083,
        '/ZAutomation/api/v1/login', {
          login: 'admin',
          password: 'hju890AZF'
        },
        this.session)
      .then((resp) => {
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
          this.session = cookieMap['ZWAYSession'];
        }
      });
  }
}

function postObject(host, port, path, obj, session) {
  var options = {
    uri: host + (port ? ':' + port : '') + path,
    method: 'POST',
    headers: {
      Cookie: 'ZWAYSession=' + session
    },
    resolveWithFullResponse: true
  }

  if (obj) {
    options.body = obj;
    options.json = true;
  }

  console.log('options:', options);
  return rp(options);
}


module.exports = ZWave;
