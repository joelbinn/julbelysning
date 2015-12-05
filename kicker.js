'use strict';

var intervalInMs = 1000 * 60 * 10;

function kicker() {
  var now = new Date();
  console.log('Kick: ', now, 'next will occur at: ', new Date(now.getTime() + intervalInMs));
  setTimeout(() => kicker(), intervalInMs);
}

module.exports = kicker;

