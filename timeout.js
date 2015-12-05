'use strict';

handleTimeout();


var intervalInMs = 1000 * 60 * 10;

function handleTimeout() {
  var now = new Date();
  console.log('Timed out at: ', now, 'next will occur at: ', new Date(now.getTime() + intervalInMs));
  setTimeout(() => handleTimeout(), intervalInMs);
}

