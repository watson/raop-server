'use strict'

var net = require('net')
var mdns = require('raop-mdns-server')
var xtend = require('xtend')
var pkg = require('./package')
var debug = require('debug')(pkg.name)

var raop = module.exports = function (opts, onRequest) {
  if (typeof opts === 'function') return raop(null, opts)
  if (typeof opts === 'string') return raop({ name: opts }, onRequest)
  if (!opts) opts = {}

  var server = net.createServer(onRequest)

  server.on('listening', function () {
    var port = server.address().port
    debug('Listening on port %d', port)

    opts = xtend({ name: 'Node.js', version: pkg.version, port: port }, opts)

    mdns(opts, function (err) {
      if (err) server.emit('error', err)
    })
  })

  return server
}
