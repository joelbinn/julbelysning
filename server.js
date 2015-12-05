'use strict';
console.log('Starting...');

const YAML = require('yamljs');
const Scheduler = require('./Scheduler');
const ZWave = require('./ZWave');
const argv = require('minimist')(process.argv.slice(2));

console.log('options:', argv);

const schedule = YAML.load(argv.s || argv.schedule || 'schedule.yaml').schedule;
const zwave = new ZWave(argv.h || argv.host || 'localhost');
const scheduler = new Scheduler(schedule, (s) => zwave.setSwitch(s));
zwave.login().then(()=>scheduler.run());
