'use strict';

var net = require('net');
var mdns = require('mdns');
var getmac = require('getmac');
var debug = require('debug')('raop');

module.exports = function (onRequest) {
  var server = net.createServer(onRequest);
  server.on('listening', function () {
    start(server.address().port);
  });
  return server;
};

var start = function (port) {
  debug('Getting server MAC address');
  getmac.getMac(function (err, mac) {
    mac = mac.toUpperCase().replace(/:/g, '');

    var options = {
      name: mac + '@Node.js',
      txtRecord: {
        txtvers: '1',       // TXT record version 1
        ch: '2',            // audio channels: stereo
        cn: '0,1',          // audio codecs
        ek: '1',            // ?
        et: '0,1',          // supported encryption types
        sv: 'false',        // ?
        da: 'true',         // ?
        sr: '44100',        // audio sample rate: e.g. 44100 Hz
        ss: '16',           // audio sample size: e.g. 16-bit
        pw: 'false',        // does the speaker require a password?
        vn: '65537',        // ?
        tp: 'TCP,UDP',      // supported transport: TCP or UDP
        vs: '105.1',        // server version
        am: 'AirPort4,107', // device model
        fv: '76400.10',     // ?
        sf: '0x0'           // ?
      }
    };

    debug('Starting server with name %s...', options.name);
    var ad = mdns.createAdvertisement(mdns.tcp('raop'), port, options);
    ad.start();
  });
};
