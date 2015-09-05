'use strict'

var raop = require('./')('Debug RAOP Server')

raop.on('request', function (c) {
  console.log(c)
})

raop.listen(7000)
