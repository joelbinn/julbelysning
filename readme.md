screen -S julbelysning /usr/local/bin/node /home/pi/projekt/julbelysning/server.js
screen -D -r <session>

forever -a -l server.log start server.js -s julschema.yaml
