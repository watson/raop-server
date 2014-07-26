# raop-server

An RAOP server

## Installation

```
npm install raop-server
```

## Example usage

```javascript
var raop = require('raop-server')('My RAOP Server');

raop.on('request', function (c) {
  // do your stuff
});

raop.listen(7000); // start server on port 7000
```

## API

### Constructor

Get the constructor by requireing the `raop-server` node module and call
it. It takes the optional arguments `name`, `txtRecord` and `onRequest`.
Either of them can be left out, so calling with only `txtRecord` or only
`name` and `onRequest` is ok:

```javascript
require('raop-server')(name, txtRecord, onRequest);
```

Constructor arguments:

- `name` - name of the AirPlay server (default: 'Node.js')
- `txtRecord` - object used to replace stock TXT record
- `onRequest` - callback function called upon each request (default: No listener is added. Remember to manually listen on the `request` event)

### Server

The constructor returns a basic Node.js TCP server, so remember to call
`.listen()` and optionally add a `request` event listener if one hasn't
been provided as an argument to the constructor.

## License

MIT
