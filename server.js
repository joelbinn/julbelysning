'use strict';
console.log('Starting...');

const http = require('http');
const fs = require('fs');
const Rx = require('rx');
const YAML = require('yamljs');
const Scheduler = require('./Scheduler');
const ZWave = require('./ZWave');
const rp = require('request-promise');
const argv = require('minimist')(process.argv.slice(2));

console.log('options:', argv);

const schedule = YAML.load(argv.s || 'schedule.yaml').schedule;
const zwave = new ZWave(argv.h || 'localhost');
const scheduler = new Scheduler(schedule, (s) => zwave.setSwitch(s));
zwave.login().then(()=>scheduler.run());
