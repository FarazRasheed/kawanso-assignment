'use strict';

var app = require('./index');
var http = require('http');

const redis = require("redis");
const client = redis.createClient();

client.on('connect', () => { 
  console.log('Connected to redis server.')
})

client.on('error', () =>{
  console.log('Unable to connect to redis server.')
})
var server = http.Server(app);
server.listen(process.env.PORT || 8000);

server.on('listening', function () {
  global.log.info('Server listening on http://localhost:%d', this.address().port);
});


