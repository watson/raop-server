# raop-server

A RAOP server

## Installation

```
npm install raop-server
```

## Example usage

```js
var raop = require('raop-server')('My RAOP Server')

raop.on('request', function (c) {
  // do your stuff
})

raop.listen(7000) // start server on port 7000
```

## API

### Constructor

Get the constructor by requireing the `raop-server` node module and call
it. It takes the optional arguments `name`, `options` and `onRequest`.
Either of them can be left out, so calling with only `options` or only
`name` and `onRequest` is ok:

```js
require('raop-server')(name, options, onRequest)
```

Constructor arguments:

- `name` - name of the AirPlay server (default: 'Node.js')
- `options` - custom configuration of the raop server:
  - `txt` - object used to replace stock TXT record
  - `mac` - spoof the MAC address
- `onRequest` - callback function called upon each request (default: No listener is added. Remember to manually listen on the `request` event)

### Server

The constructor returns a basic Node.js TCP server, so remember to call
`.listen()` and optionally add a `request` event listener if one hasn't
been provided as an argument to the constructor.

## License

MIT
