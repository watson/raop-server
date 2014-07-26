'use strict';

var net = require('net');
var mdns = require('mdns');
var getmac = require('getmac');
var debug = require('debug')('raop');

var pkg = require('./package.json');

module.exports = function (name, txtRecord, onRequest) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  } else if (typeof name === 'function') {
    onRequest = name;
    name = undefined;
  } else if (typeof txtRecord === 'function') {
    onRequest = txtRecord;
    txtRecord = undefined;
  }
  if (!name) name = 'Node.js';

  var start = function () {
    debug('Getting server MAC address');
    getmac.getMac(function (err, mac) {
      if (err) throw err;

      var port = server.address().port;
      var model = 'NodeAirPlay' + pkg.version.split('.').slice(0,-1).join(',');

      txtRecord = txtRecord || {
        cn: '0,1,2,3',        // audio codecs
        da: 'true',
        et: '0,3,5',          // supported encryption types
        ft: '0x5A7FFFF7,0xE', // ? seems to be the same as 'features' in AirPlay
        md: '0,1,2',          // supported metadata types
        am: model,            // device model
        sf: '0x44',           // ? seems to be the same as 'flags' in AirPlay
        tp: 'UDP',            // supported transport
        vn: '65537',
        vs: pkg.version,      // server version
        vv: '2'               // ? maybe the txt record format version
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
