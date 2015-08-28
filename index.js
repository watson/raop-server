'use strict'

var net = require('net')
var mdns = require('mdns')
var getmac = require('getmac')
var debug = require('debug')('raop')

var raop = module.exports = function (name, opts, onRequest) {
  if (!name) name = 'Node.js'
  if (!opts) opts = {}
  if (typeof name === 'object') return raop(null, name, opts)
  if (typeof name === 'function') return raop(null, null, name)
  if (typeof opts === 'function') return raop(name, null, opts)

  var txt = opts.txt

  if (!txt) {
    var pkg = require('./package')
    var model = 'NodeAirPlay' + pkg.version.split('.').slice(0, -1).join(',')
    txt = {
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
    }
  }

  var broadcast = function (mac) {
    var port = server.address().port
    var fullName = mac.toUpperCase().replace(/:/g, '') + '@' + name
    debug('Starting server %s - port %d...', fullName, port)
    mdns
      .createAdvertisement(mdns.tcp('raop'), port, { name: fullName, txtRecord: txt })
      .start()
  }

  var getMac = function (cb) {
    debug('Getting server MAC address')
    getmac.getMac(function (err, mac) {
      if (err) return server.emit('error', err)
      debug('Found MAC address', mac)
      cb(mac)
    })
  }

  var start = function () {
    if (opts.mac) broadcast(opts.mac)
    else getMac(broadcast)
  }

  var server = net.createServer(onRequest)
  server.on('listening', start)
  return server
}
