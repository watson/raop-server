'use strict';

var net = require('net');
var mdns = require('mdns');
var getmac = require('getmac');
var debug = require('debug')('raop');

var pkg = require('./package.json');

var raop = module.exports = function (name, txtRecord, onRequest) {
  if (!name) name = 'Node.js';
  if (typeof name === 'object') return raop(null, name, txtRecord);
  if (typeof name === 'function') return raop(null, null, name);
  if (typeof txtRecord === 'function') return raop(name, null, txtRecord);

  var start = function () {
    debug('Getting server MAC address');
    getmac.getMac(function (err, mac) {
      if (err) throw err;

      var port = server.address().port;
      var model = 'NodeAirPlay' + pkg.version.split('.').slice(0,-1).join(',');

      txtRecord = txtRecord || {
        txtvers: '1',    // TXT record version 1
        ch: '2',         // audio channels: stereo
        cn: '0,1,2,3',   // audio codecs
        et: '0,3,5',     // supported encryption types
        md: '0,1,2',     // supported metadata types
        pw: 'false',     // does the speaker require a password?
        sr: '44100',     // audio sample rate: 44100 Hz
        ss: '16',        // audio sample size: 16-bit
        tp: 'UDP',       // supported transport: TCP or UDP
        vs: pkg.version, // server version
        am: model        // device model
      };

      debug('Starting server with name %s...', name);
      mdns
        .createAdvertisement(mdns.tcp('raop'), port, {
          name: mac.toUpperCase().replace(/:/g, '') + '@' + name,
          txtRecord: txtRecord
        })
        .start();
    });
  };

  var server = net.createServer(onRequest);
  server.on('listening', start);
  return server;
};
