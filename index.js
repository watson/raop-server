'use strict';

var net = require('net');
var mdns = require('mdns');
var getmac = require('getmac');
var debug = require('debug')('raop');

var pkg = require('./package.json');

module.exports = function (name, options, onRequest) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  } else if (typeof name === 'function') {
    onRequest = name;
    name = undefined;
  } else if (typeof options === 'function') {
    onRequest = options;
    options = undefined;
  }
  if (!options) options = {};
  if (!options.txt) options.txt = {};
  if (!options.name) options.name = name || 'Node.js';

  var start = function () {
    debug('Getting server MAC address');
    getmac.getMac(function (err, mac) {
      if (err) throw err;

      var port = server.address().port;
      var name = mac.toUpperCase().replace(/:/g, '') + '@' + options.name;
      var model = 'NodeAirPlay' + pkg.version.split('.').slice(0,-1).join(',');

      var mdnsOpt = {
        name: name,
        txtRecord: {
          txtvers: options.txt.txtvers || '1', // TXT record version 1
          ch: options.txt.ch || '2',           // audio channels: stereo
          cn: options.txt.cn || '0,1',         // audio codecs
          ek: options.txt.ek || '1',           // ?
          et: options.txt.et || '0,1',         // supported encryption types
          sv: options.txt.sv || 'false',       // ?
          da: options.txt.da || 'true',        // ?
          sr: options.txt.sr || '44100',       // audio sample rate: e.g. 44100 Hz
          ss: options.txt.ss || '16',          // audio sample size: e.g. 16-bit
          pw: options.txt.pw || 'false',       // does the speaker require a password?
          vn: options.txt.vn || '65537',       // ?
          tp: options.txt.tp || 'TCP,UDP',     // supported transport: TCP or UDP
          vs: options.txt.vs || pkg.version,   // server version
          am: options.txt.am || model,         // device model
          fv: options.txt.fv || '76400.10',    // ?
          md: options.txt.md || '0,1,2',       // supported metadata types
          sf: options.txt.sf || '0x0'          // ?
        }
      };

      debug('Starting server with name %s...', options.name);
      var ad = mdns.createAdvertisement(mdns.tcp('raop'), port, mdnsOpt);
      ad.start();
    });
  };

  var server = net.createServer(onRequest);
  server.on('listening', start);
  return server;
};
