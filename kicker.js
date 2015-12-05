'use strict';

var intervalInMs = 1000 * 60 * 30;

function kicker() {
  var now = new Date();
  console.log('Kick: ', now, 'next will occur at: ', new Date(now.getTime() + intervalInMs));
  setTimeout(() => handleTimeout(), intervalInMs);
}

module.export = kicker;

